[Gin-\***\*模型绑定和验证\*\***](https://gin-gonic.com/zh-cn/docs/examples/binding-and-validation/)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/191b0c24-da88-481e-8e90-4df2094f1afb/Untitled.png)

# 一、新增用户接口

新增用户，我们主要有两个逻辑：1.检查用户名称是否已存在，避免重名，2.新增用户数据。

## 1.model/User.go

```js
package model

+import (
+	"fmt"
+	"ginblog/utils/errmsg"
	"gorm.io/gorm"
+)

type User struct {
	gorm.Model
	Username string `gorm:"type:varchar(20);not null" json:"username"`
	Password string `gorm:"type:varchar(20);not null" json:"password"`
	Role     int    `gorm:"type:int" json:"role"`
}

// 查询用户是否存在
+func CheckUser(name string) (code int) {
+	var users User
+	db.Select("id").Where("username = ?", name).First(&users)
+	fmt.Println(users)
+	if users.ID > 0 {
+		return errmsg.ERROR_USERNAME_USED // 1001
+	}
+	return errmsg.SUCCESS
+}

// 新增用户
+func CreateUser(data *User) int {
+	err := db.Create(&data).Error
+	if err != nil {
+		return errmsg.ERROR // 500
+	}
+	return errmsg.SUCCESS
+}
```

## 2.api/v1/user.go

```js
package v1

import (
	"fmt"
	"ginblog/model"
	"ginblog/utils/errmsg"
	"github.com/gin-gonic/gin"
	"net/http"
)

var code int

// 添加用户
func AddUser(c *gin.Context) {
	var data model.User
	_ = c.ShouldBindJSON(&data)
	code = model.CheckUser(data.Username)
	fmt.Println("hello world", code)
	if code == errmsg.SUCCESS {
		model.CreateUser(&data)
	}
	if code == errmsg.ERROR_USERNAME_USED {
		code = errmsg.ERROR_USERNAME_USED
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}
```

## 3.调试

此时**打开数据库** ，并且运行项目，发现有错误：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d227c4f3-d250-4077-8954-f3a061970327/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b75881f0-2844-49da-9594-726be6d8d1f8/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/41012b30-0c79-4a6d-938c-7314326ba024/Untitled.png)

**解决方法：**

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4b85c8ba-b6a5-4828-a5b1-b41d895facb2/Untitled.png)

运行成功之后，我们就可以用 apipost 来模拟请求了，选用 apipost 的理由是，它相对于 postman 更方便，能自动生成接口文档。

调试成功之后记得将成功/失败结果复制到相应的示例中。

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9dafc3b6-a4f3-45fa-b738-3b1b9a88fe65/Untitled.png)

# 二、查询用户列表接口

一般来说，只要是列表接口，都是需要有分页功能的。我们这里的接口切片返回数据。

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8779c971-4722-4d31-92e8-10404b05b464/Untitled.png)

## 1.model/User.go

```js
// 查询用户列表
func GetUsers(pageSize int, pageNum int) []User {
	var users []User
	err = db.Limit(pageSize).Offset((pageNum - 1) * pageSize).Find(&users).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil
	}
	return users
}
```

## 2.api/v1/user.go

```js
// 查询用户列表

func GetUsers(c *gin.Context) {
	pageSize, _ := strconv.Atoi(c.Query("pageSize"))
	pageNum, _ := strconv.Atoi(c.Query("pageNum"))

	if pageSize == 0 {
		pageSize = -1
	}
	if pageNum == 0 {
		pageNum = -1
	}
	data := model.GetUsers(pageSize, pageNum)
	code = errmsg.SUCCESS
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"data":    data,
		"message": errmsg.GetErrMsg(code),
	})
}
```

## 3.routes/router.go

```js
router := r.Group("api/v1")
	{
		// User模块的路由接口
		router.POST("user/add", v1.AddUser)
+ 		router.GET("users", v1.GetUsers)
	}
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/41d3f3e6-4e7c-4933-ab5a-d8ee7d8b551f/Untitled.png)

#
