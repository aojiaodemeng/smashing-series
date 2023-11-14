# 一、后端数据验证

目前新增用户是没有做任何限制，可以在 apipost、postman 等工具里新增有权限的用户，这样就可以直接在管理后台做一些操作了。

### 1.更改 model/user.go 文件

更改 user 结构体

```js
// 更改前：
type User struct {
	gorm.Model
	Username string `gorm:"type:varchar(20);not null" json:"username"`
	Password string `gorm:"type:varchar(20);not null" json:"password"`
	Role     int    `gorm:"type:int" json:"role"`
}

// 更改后：
type User struct {
	gorm.Model
	Username string `gorm:"type:varchar(20);not null" json:"username" validate:"required,min=4,max=12"`
	Password string `gorm:"type:varchar(20);not null" json:"password" validate:"required,min=6,max=20"`
	Role     int    `gorm:"type:int;DEFAULT:2" json:"role" validate:"required,gte=2"`
}
```

```js
// 登录验证
func CheckLogin(username string, password string) int {
	...
	if user.Role != 1 {    // 这里原来的0改为了1
		return errmsg.ERROR_USER_NO_RIGHT
	}
	return errmsg.SUCCESS
}
```

### 2.新建 utils/validator/validater.go

```js
package validator

import (
	"fmt"
	"ginblog/utils/errmsg"
	"github.com/go-playground/locales/zh_Hans_CN"
	unTrans "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	zhTrans "github.com/go-playground/validator/v10/translations/zh"
)

func Validate(data interface{}) (s string, string int) {
	validate := validator.New()
	uni := unTrans.New(zh_Hans_CN.New())
	trans, _ := uni.GetTranslator("zh_Hans_CN")

	err := zhTrans.RegisterDefaultTranslations(validate, trans)

	if err != nil {
		fmt.Println("err:", err)
	}
	err = validate.Struct(data)
	if err != nil {
		for _, v := range err.(validator.ValidationErrors) {
			return v.Translate(trans), errmsg.ERROR
		}
	}
	return "", errmsg.SUCCESS
}
```

### 3.更改 api/v1/user.go 文件

加入以下代码：

```js
// 添加用户
func AddUser(c *gin.Context) {
	var data model.User
	var msg string
	msg, code = validator.Validate(&data)
	if code != errmsg.SUCCESS {
		c.JSON(http.StatusOK, gin.H{
			"status":  code,
			"message": msg,
		})
		return
	}
	...
}
```

重启项目，调用新增用户接口：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4455e63b-3c26-4d73-917f-41bb7171ce46/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bca84663-3c80-443a-83a9-aba378fa61fd/Untitled.png)

再进行优化下，可以发现上面的提示，字段是英文的，我们可以改下：

```js
model/User.go

// 修改前：
type User struct {
	gorm.Model
	Username string `gorm:"type:varchar(20);not null" json:"username" validate:"required,min=4,max=12"`
	Password string `gorm:"type:varchar(20);not null" json:"password" validate:"required,min=6,max=20"`
	Role     int    `gorm:"type:int;DEFAULT:2" json:"role" validate:"required,gte=2"`
}

// 修改后
type User struct {
	gorm.Model
	Username string `gorm:"type:varchar(20);not null" json:"username" validate:"required,min=4,max=12" label:"用户名"`
	Password string `gorm:"type:varchar(20);not null" json:"password" validate:"required,min=6,max=20" label:"密码"`
	Role     int    `gorm:"type:int;DEFAULT:2" json:"role" validate:"required,gte=2"  label:"角色码"`
}
```

validator/validator.go:

```js
func Validate(data interface{}) (s string, string int) {
	...
	validate.RegisterTagNameFunc(func(field reflect.StructField) string {
		label := field.Tag.Get("label")
		return label
	})

}
```

这段代码会报错，暂时先注释。。。。

# 二、跨域参数配置

这里我们使用官方工具包：[gin-contrib/cors](https://pkg.go.dev/github.com/gin-contrib/cors)

\***\*[跨域资源共享 CORS 详解-阮一峰](https://www.ruanyifeng.com/blog/2016/04/cors.html)\*\***

## 1.安装

```js
go get -u github.com/gin-contrib/cors
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4b48ce86-dc41-42a5-ad8a-75ea1b6c5f2f/Untitled.png)

## 2.新建 middleware/cors.go

第一个版本（不通）：

```js
package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func Cors() gin.HandlerFunc {
	return func(c gin.Context) {
		cors.New(cors.Config{
			AllowOrigins:  []string{"*"},
			AllowMethods:  []string{"*"},
			AllowHeaders:  []string{"Origin"},
			ExposeHeaders: []string{"Content-Length", "Authorization"},
			//AllowCredentials: true,
			//AllowOriginFunc: func(origin string) bool {
			//	return origin == "https://github.com"
			//},
			MaxAge: 12 * time.Hour,
		})
	}
}
```

第二个版本：

```js
package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func Cors() gin.HandlerFunc {
	// return cors.Default()
	// return cors.New(cors.Config{
	// 	AllowOrigins: []string{"*"},
	// 	AllowMethods: []string{"*"},
	// 	AllowHeaders: []string{"Origin"},
	// 	//ExposeHeaders: []string{"Content-Length", "Authorization"},
	// 	//AllowCredentials: true,
	// 	//AllowOriginFunc: func(origin string) bool {
	// 	//	return origin == "https://github.com"
	// 	//},
	// 	MaxAge: 12 * time.Hour,
	// })
	return cors.New(
		cors.Config{
			//AllowAllOrigins:  true,
			AllowOrigins:     []string{"*"}, // 等同于允许所有域名 #AllowAllOrigins:  true
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"*", "Authorization"},
			ExposeHeaders:    []string{"Content-Length", "text/plain", "Authorization", "Content-Type"},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		},
	)
}
```

### 3.routes/routes.go

```js
func InitRouter(){
	r.Use(middleware.Cors())
}
```

# 三、增加列表查询的总数返回

详情看 commit，很简单，不做描述了

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/449d2363-d675-46a8-b11d-c38674f1e034/Untitled.png)
