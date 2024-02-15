对于后端来说，错误处理是非常重要的，出了网络传输的错误，在正常业务流程范围内还有很多可预见性的错误，比如 username 不允许重名，当前端创建账户时，后端需要对前端发送过来的 username 进行校验

# 一、定义业务状态码

新建 utils/errmsg/errmsg.go 文件

```js
package errmsg

const (
	SUCCESS = 200
	ERROR   = 500

	// code = 1000  用户模块的错误
	ERROR_USERNAME_USED    = 1001
	ERROR_PASSWORD_WRONG   = 1002
	ERROR_USER_NOT_EXIST   = 1003
	ERROR_TOKEN_EXIST      = 1004
	ERROR_TOKEN_RUNTIME    = 1005
	ERROR_TOKEN_WRONG      = 1006
	ERROR_TOKEN_TYPE_WRONG = 1007
	// code = 2000  文章模块的错误

	// code = 3000  分类模块的错误
)

var codemsg = map[int]string{
	SUCCESS:                "OK",
	ERROR:                  "FAIL",
	ERROR_USERNAME_USED:    "用户名已存在",
	ERROR_PASSWORD_WRONG:   "密码错误",
	ERROR_USER_NOT_EXIST:   "用户不存在",
	ERROR_TOKEN_EXIST:      "TOKEN不存在",
	ERROR_TOKEN_RUNTIME:    "TOKEN已过期",
	ERROR_TOKEN_WRONG:      "TOKEN不正确",
	ERROR_TOKEN_TYPE_WRONG: "TOKEN格式错误",
}

func GetErrMsg(code int) string {
	return codemsg[code]
}
```

# 二、定义接口

新建 api/v1/user.go 文件

```js
package v1

import "github.com/gin-gonic/gin"

// 查询用户是否存在
func UserExist(c *gin.Context) {
	//
}

// 添加用户
func AddUser(c *gin.Context) {
	// todo 添加用户
}

// 查询用户列表

func GetUsers(c *gin.Context) {

}

// 编辑用户
func EditUsers(c *gin.Context) {

}

// 删除用户
func DeleteUser(c *gin.Context) {

}
```

# 三、定义路由

更改 routes/router.go 文件

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

	//router := r.Group("api/vi")
	//{
	//	router.GET("hello", func(c *gin.Context) {
	//		c.JSON(http.StatusOK, gin.H{
	//			"msg": "ok",
	//		})
	//	})
	//}

	router := r.Group("api/vi")
	{
		// User模块的路由接口
		router.POST("user/add", v1.AddUser)
		router.GET("users", v1.GetUsers)
		router.PUT("user/:id", v1.EditUsers)
		router.DELETE("user/:id", v1.DeleteUser)
	}

	r.Run(utils.HttpPort)
}
```
