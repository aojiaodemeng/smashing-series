- 新增文章不需要做验证

# model/Article.go

```js
package model

import (
	"ginblog/utils/errmsg"
	"gorm.io/gorm"
)

type Article struct {
	gorm.Model
	Category   Category `gorm:"foreignKey:CategoryId"`
	Title      string   `gorm:"type:varchar(20);not null" json:"title"`
	CategoryId int      `gorm:"type:int;not null" json:"categoryId"`
	Desc       string   `gorm:"type:varchar(200)" json:"desc"`
	Content    string   `gorm:"type:longtext" json:"content"`
	Img        string   `gorm:"type:varchar(100)" json:"img"`
}

// 新增文章
func CreateArticle(data *Article) int {
	err := db.Create(&data).Error
	if err != nil {
		return errmsg.ERROR // 500
	}
	return errmsg.SUCCESS
}

// TODO: 查询单个文章

// 查询文章列表
func GetArticles(pageSize int, pageNum int) []Article {
	var article []Article
	err = db.Limit(pageSize).Offset((pageNum - 1) * pageSize).Find(&article).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil
	}
	return article
}

// 编辑文章
func EditArticle(id int, data *Article) int {
	var article Article
	var maps = make(map[string]interface{})
	maps["title"] = data.Title
	maps["category_id"] = data.CategoryId
	maps["desc"] = data.Desc
	maps["content"] = data.Content
	maps["img"] = data.Img
	err = db.Model(&article).Where("id=?", id).Updates(maps).Error
	if err != nil {
		return errmsg.ERROR
	}
	return errmsg.SUCCESS
}

// 删除文章
func DeleteArticle(id int) int {
	var article Article
	err = db.Where("id=?", id).Delete(&article).Error
	if err != nil {
		return errmsg.ERROR
	}
	return errmsg.SUCCESS
}
```

# api/v1/article.go

```js
package v1

import (
	"fmt"
	"ginblog/model"
	"ginblog/utils/errmsg"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// 添加文章
func AddArticle(c *gin.Context) {
	var data model.Article
	_ = c.ShouldBindJSON(&data)

	code = model.CreateArticle(&data)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// 查询分类列表
func GetArticles(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))
	pageNum, _ := strconv.Atoi(c.Query("pageNum"))

	if pageSize == 0 {
		pageSize = -1
	}
	if pageNum == 0 {
		pageNum = -1
	}
	data := model.GetArticles(pageSize, pageNum)
	fmt.Println("hello world", data)
	code = errmsg.SUCCESS
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// 编辑文章
func EditArticle(c *gin.Context) {
	var data model.Article
	id, _ := strconv.Atoi(c.Param("id"))
	c.ShouldBindJSON(&data)
	code = model.EditArticle(id, &data)

	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 删除分类
func DeleteArticle(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	code = model.DeleteArticle(id)
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}
```

# router.go

```js
{
  // User模块的路由接口
  router.POST('user/add', v1.AddUser);
  router.GET('users', v1.GetUsers);
  router.PUT('user/:id', v1.EditUsers);
  router.DELETE('user/:id', v1.DeleteUser);

  // Category 模块的路由接口
  router.POST('category/add', v1.AddCategory);
  router.GET('categories', v1.GetCategories);
  router.PUT('category/:id', v1.EditCategory);
  router.DELETE('category/:id', v1.DeleteCategory);

  // Category 模块的路由接口
  router.POST('article/add', v1.AddArticle);
  router.GET('articles', v1.GetArticles);
  router.PUT('article/:id', v1.EditArticle);
  router.DELETE('article/:id', v1.DeleteArticle);
}
```

# 测试

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/25891125-5fc4-44d2-acb5-570c9b7edceb/Untitled.png)
