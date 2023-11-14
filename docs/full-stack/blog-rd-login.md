# 一、model/User.go

新增`CheckLogin`方法

```js
// 登录验证
func CheckLogin(username string, password string) int {
	var user User
	db.Where("username = ?", username).First(&user)
	if user.ID == 0 {
		return errmsg.ERROR_USER_NOT_EXIST       // 用户不存在
	}
	if ScryptPw(password) != user.Password {
		return errmsg.ERROR_PASSWORD_WRONG       // 密码错误

	}
	if user.Role != 0 {
		return errmsg.ERROR_USER_NO_RIGHT        // 该用户无权限
	}
	return errmsg.SUCCESS
}
```

# 二、新建 api/v1/login.go

```js
package v1

import (
	"ginblog/middleware"
	"ginblog/model"
	"ginblog/utils/errmsg"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Login(c *gin.Context) {
	var data model.User
	c.ShouldBindJSON(&data)
	var token string
	var code int

	code = model.CheckLogin(data.Username, data.Password)

	if code == errmsg.SUCCESS {
		token, _ = middleware.SetToken(data.Username)
	}
	c.JSON(http.StatusOK, gin.H{
		"status":  code,
		"message": errmsg.GetErrMsg(code),
		"token":   token,
	})
}
```

# 三、调整 router

有些接口不需要鉴权，所以需要分类

之前是这样的：

```js
package routes

import (
	v1 "ginblog/api/v1"
	"ginblog/utils"
	"github.com/gin-gonic/gin"
)

func InitRouter() {
	gin.SetMode(utils.AppMode)
	r := gin.Default()

	router := r.Group("api/v1")
	{
		// User模块的路由接口
		router.POST("user/add", v1.AddUser)
		router.GET("users", v1.GetUsers)
		router.PUT("user/:id", v1.EditUsers)
		router.DELETE("user/:id", v1.DeleteUser)

		// Category 模块的路由接口
		router.POST("category/add", v1.AddCategory)
		router.GET("categories", v1.GetCategories)
		router.PUT("category/:id", v1.EditCategory)
		router.DELETE("category/:id", v1.DeleteCategory)

		// Article 模块的路由接口
		router.POST("article/add", v1.AddArticle)
		router.GET("articles", v1.GetArticles)
		router.PUT("article/:id", v1.EditArticle)
		router.DELETE("article/:id", v1.DeleteArticle)
		router.GET("article/list/:id", v1.GetCategoryArticles)
		router.GET("article/info/:id", v1.GetArticleInfo)
	}

	r.Run(utils.HttpPort)
}
```

现在我们进行分类：

```js
package routes

import (
	v1 "ginblog/api/v1"
	"ginblog/middleware"
	"ginblog/utils"
	"github.com/gin-gonic/gin"
)

func InitRouter() {
	gin.SetMode(utils.AppMode)
	r := gin.Default()

	//router := r.Group("api/vi")
	//{
	//	router.GET("hello", func(c *gin.Context) {
	//		c.JSON(http.StatusOK, gin.H{
	//			"msg": "ok",
	//		})
	//	})
	//}

	auth := r.Group("api/v1")
	auth.Use(middleware.JwtToken())
	{
		// User模块的路由接口

		auth.PUT("user/:id", v1.EditUsers)
		auth.DELETE("user/:id", v1.DeleteUser)

		// Category 模块的路由接口
		auth.POST("category/add", v1.AddCategory)
		auth.PUT("category/:id", v1.EditCategory)
		auth.DELETE("category/:id", v1.DeleteCategory)

		// Article 模块的路由接口
		auth.POST("article/add", v1.AddArticle)
		auth.PUT("article/:id", v1.EditArticle)
		auth.DELETE("article/:id", v1.DeleteArticle)
	}
	router := r.Group("api/v1")
	{
		router.POST("user/add", v1.AddUser)
		router.GET("users", v1.GetUsers)
		router.GET("categories", v1.GetCategories)
		router.GET("articles", v1.GetArticles)
		router.GET("article/list/:id", v1.GetCategoryArticles)
		router.GET("article/info/:id", v1.GetArticleInfo)
		router.POST("login", v1.Login)
	}
	r.Run(utils.HttpPort)
}
```

# 四、测试

重新启动服务

## 4-1.先新建两个用户，role 分别为 0 和 1，1 代表有权限

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2ef526c4-1676-4712-8252-18225ed192ba/Untitled.png)

## 4-2.测试登录接口

测试有权限的用户登录：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0549b556-a616-4b00-896d-3a14801a1a02/Untitled.png)

测试无权限的用户登录：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dbb15bd6-9ef1-44c9-83fb-42070b9a9c6a/Untitled.png)

## 4-3.测试有无鉴权的接口

有正确的 token：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/388b3179-06c3-4534-8bfe-65f6a4d26564/Untitled.png)

不携带 token：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b714caea-d65b-4db1-a736-daddcdff79ec/Untitled.png)
