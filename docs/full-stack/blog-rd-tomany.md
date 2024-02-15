可以先使用 SQL 编辑器，编写 SQL 查询语句进行两张表的数据联动查询。这一方面的知识可以参考数据《SQL 必知必会（第 5 版）》

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e731b3fa-8734-47c3-83cf-7c7475474bd7/Untitled.png)

其中，Category 结构体包含了 Article 结构体，即 Category 与 Article 是属于 1:n 的关系。

在之前，其实已经做了物理外键的处理：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0b9985ad-e364-41cc-92c0-5ee10a3a4def/Untitled.png)

# 一、对 model/Article.go 文件里的 GetArticles 方法进行改造

之前是这样的：

```js
// 查询文章列表
func GetArticles(pageSize int, pageNum int) []Article {
	var article []Article
	err = db.Limit(pageSize).Offset((pageNum - 1) * pageSize).Find(&article).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil
	}
	return article
}
```

现在我们需要返回 code，并且要实现联动表格查询：

```js
// 查询文章列表
func GetArticles(pageSize int, pageNum int) ([]Article, int) {
	var article []Article
	err = db.Preload("Category").Limit(pageSize).Offset((pageNum - 1) * pageSize).Find(&article).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, errmsg.ERROR
	}
	return article, errmsg.SUCCESS
}
```

# 二、model/Article.go 文件新增方法`GetCategoryArticles`、`GetArticleInfo`

```js
// 查询分类下的所有文章
func GetCategoryArticles(id int, pageSize int, pageNum int) ([]Article, int) {
	var categoryArticles []Article
	err := db.Preload("Category").Limit(pageSize).Offset((pageNum-1)*pageSize).Where("category_id=?", id).Find(&categoryArticles).Error
	if err != nil {
		return nil, errmsg.ERROR_CATEGORY_EXIST
	}
	return categoryArticles, errmsg.SUCCESS
}

// 查询单个文章
func GetArticleInfo(id int) (Article, int) {
	var article Article
	err := db.Preload("Category").Where("id=?", id).First(&article).Error
	if err != nil {
		return article, errmsg.ERROR_ARTICLE_NOT_EXIST
	}
	return article, errmsg.SUCCESS
}
```

# 三、api/v1/article.go

## 新增两个方法：

```js
// 查询分类下的所有文章
func GetCategoryArticles(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))
	pageNum, _ := strconv.Atoi(c.Query("pageNum"))
	id, _ := strconv.Atoi(c.Param("id"))
	if pageSize == 0 {
		pageSize = -1
	}
	if pageNum == 0 {
		pageNum = -1
	}
	data, code := model.GetCategoryArticles(id, pageSize, pageNum)
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}
// 查询单个文章信息
func GetArticleInfo(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	data, code := model.GetArticleInfo(id)
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}
```

## 并更改一个方法：

```js
// 查询文章列表
func GetArticles(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))
	pageNum, _ := strconv.Atoi(c.Query("pageNum"))

	if pageSize == 0 {
		pageSize = -1
	}
	if pageNum == 0 {
		pageNum = -1
	}
-	data := model.GetArticles(pageSize, pageNum)
+	data, code := model.GetArticles(pageSize, pageNum)
	fmt.Println("hello world", data)
-	//code = errmsg.SUCCESS
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}
```

# 四、errmsg.go 增加 code

```js
const (
	SUCCESS = 200
	ERROR   = 500

	...
	// code = 2000  文章模块的错误
	ERROR_ARTICLE_NOT_EXIST = 2001
	// code = 3000  分类模块的错误
	ERROR_CATEGORY_USED  = 3001
	ERROR_CATEGORY_EXIST = 3002
)

var codemsg = map[int]string{
	...
	ERROR_ARTICLE_NOT_EXIST: "文章不存在",
	ERROR_CATEGORY_USED:     "该分类已存在",
	ERROR_CATEGORY_EXIST:    "该分类不存在",
}
```

# 五、router.go

```js

...
router.GET("article/list/:id", v1.GetCategoryArticles)
router.GET("article/info/:id", v1.GetArticleInfo)
```
