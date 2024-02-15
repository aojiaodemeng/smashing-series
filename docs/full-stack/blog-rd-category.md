博客分类比较简单，实际实现可以简化下结构体。

- ID：主键、自增变量

# 一、model/Category.go

```js
package model

import (
	"ginblog/utils/errmsg"
	"gorm.io/gorm"
)

type Category struct {
	ID   uint   `gorm:"primary_key;auto_increment" json:"id"`
	Name string `gorm:"type:varchar(20);not null" json:"name"`
}

// 查询分类是否存在
func CheckCategory(name string) (code int) {
	var category Category
	db.Select("id").Where("name = ?", name).First(&category)
	if category.ID > 0 {
		return errmsg.ERROR_CATEGORY_USED
	}
	return errmsg.SUCCESS
}

// 新增分类
func CreateCategory(data *Category) int {
	err := db.Create(&data).Error
	if err != nil {
		return errmsg.ERROR // 500
	}
	return errmsg.SUCCESS
}

// 查询用户列表
func GetCategories(pageSize int, pageNum int) []Category {
	var categories []Category
	err = db.Limit(pageSize).Offset((pageNum - 1) * pageSize).Find(&categories).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil
	}
	return categories
}

// 编辑分类
func EditCategory(id int, data *Category) int {
	var category Category
	var maps = make(map[string]interface{})
	maps["name"] = data.Name
	err = db.Model(&category).Where("id=?", id).Updates(maps).Error
	if err != nil {
		return errmsg.ERROR
	}
	return errmsg.SUCCESS
}

// 删除分类
func DeleteCategory(id int) int {
	var category Category
	err = db.Where("id=?", id).Delete(&category).Error
	if err != nil {
		return errmsg.ERROR
	}
	return errmsg.SUCCESS
}

// TODO: 查询分类下的所有文章
```

# 二、api/v1/category.go

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

// 添加分类
func AddCategory(c *gin.Context) {
	var data model.Category
	_ = c.ShouldBindJSON(&data)
	code = model.CheckCategory(data.Name)
	if code == errmsg.SUCCESS {
		model.CreateCategory(&data)
	}
	if code == errmsg.ERROR_CATEGORY_USED {
		code = errmsg.ERROR_CATEGORY_USED
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// TODO: 查询分类下的所有文章

// 查询分类列表
func GetCategories(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))
	pageNum, _ := strconv.Atoi(c.Query("pageNum"))

	if pageSize == 0 {
		pageSize = -1
	}
	if pageNum == 0 {
		pageNum = -1
	}
	data := model.GetCategories(pageSize, pageNum)
	fmt.Println("hello world", data)
	code = errmsg.SUCCESS
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}

// 编辑分类
func EditCategory(c *gin.Context) {
	var data model.Category
	id, _ := strconv.Atoi(c.Param("id"))
	c.ShouldBindJSON(&data)
	code = model.CheckCategory(data.Name)
	if code == errmsg.SUCCESS {
		model.EditCategory(id, &data)
	}
	if code == errmsg.ERROR_CATEGORY_USED {
		c.Abort()
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}

// 删除分类
func DeleteCategory(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	code = model.DeleteCategory(id)
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
	})
}
```

# 三、errmsg.go

```js
const (
	SUCCESS = 200
	ERROR   = 500

	// code = 1000  用户模块的错误
	...
	// code = 2000  文章模块的错误
+	ERROR_CATEGORY_USED = 2001
	// code = 3000  分类模块的错误
)

var codemsg = map[int]string{
	SUCCESS:                "OK",
	ERROR:                  "FAIL",
	...
+	ERROR_CATEGORY_USED:    "该分类已存在",
}
```

# 四、router.go

```js
router := r.Group("api/v1")
	{
		// User模块的路由接口
		...
		// Category 模块的路由接口
		router.POST("category/add", v1.AddCategory)
		router.GET("categories", v1.GetCategories)
		router.PUT("category/:id", v1.EditCategory)
		router.DELETE("category/:id", v1.DeleteCategory)
	}

	r.Run(utils.HttpPort)
```

# 五、测试

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/71a06113-6fa0-48bc-bcb5-0ce44d36fc3b/Untitled.png)
