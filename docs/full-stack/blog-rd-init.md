# 一、初始化项目

## 1.github 创建仓库

github 创建仓库，本地克隆下来，然后用 goland 打开项目。

## 2.设置包管理，配置[goproxy.io](http://goproxy.io/)代理

## 3.添加运行/调试配置

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f05e96c5-b497-449a-8202-b46285d30568/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2855b417-1155-4518-b346-733be1631f7e/Untitled.png)

## 4.添加主文件并初始化项目

项目中新增 mian.go 主文件。

```js
go mod init ginblog
```

其中，ginblog 是项目名称。

## 5.安装 gin

```js
go get -u github.com/gin-gonic/gin
```

go get 命令加-u 参数的作用：更新已有的代码包及其依赖包

## 6.创建文件结构

根目录下创建以下文件夹

- config：网站的配置参数文件
- model：数据库的 CRUD
- api/v1：api 入口
- middleware：中间件（跨域、验证等会用到）
- routes：路由接口
- utils：公共组件
- upload：上传，托管静态资源
- web：前端页面打包的文件托管

## 7.网站配置参数

这里引入一个库，[go-ini](https://ini.unknwon.io/)，更加方便优雅

### 7-1、安装命令：

```js
go get gopkg.in/ini.v1
```

### 7-2、创建 config/config.ini 文件

```js
[server]
# debug 开发模式，release 生产模式
AppMode = debug
HttpPort = :3000

[database]
Db = mysql
DbHost = localhost
DbPort = 3306
DbUser = root
DbPassWord = root1234
DbName = ginblog
```

### 7-3、编写获取变量的公共方法

新建 utils/setting.go 文件

```js
package utils

import (
	"fmt"
	"gopkg.in/ini.v1"
)

var (
	AppMode  string
	HttpPort string

	Db         string
	DbHost     string
	DbPort     string
	DbUser     string
	DbPassWord string
	DbName     string
)

func init() {
	file, err := ini.Load("config/config.ini")
	if err != nil {
		fmt.Println("配置文件读取错误，请检查文件路径", err)
	}
	LoadServer(file)
	LoadData(file)
}

func LoadServer(file *ini.File) {
	AppMode = file.Section("server").Key("AppMode").MustString("debug")
	HttpPort = file.Section("server").Key("HttpPort").MustString("3000")
}

func LoadData(file *ini.File) {
	Db = file.Section("database").Key("Db").MustString("mysql")
	DbHost = file.Section("database").Key("DbHost").MustString("localhost")
	DbPort = file.Section("database").Key("DbPort").MustString("3306")
	DbUser = file.Section("database").Key("DbUser").MustString("root")
	DbPassWord = file.Section("database").Key("DbPassWord").MustString("root1234")
	DbName = file.Section("database").Key("DbName").MustString("ginblog")
}
```

### 7-4、测试路由接口

在 gin 官网给出了简单 demo，我们可以根据 demo 测试下路由接口：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d65b188b-73b6-4e2f-a6ab-d177d932edc3/Untitled.png)

新建 routes/router.go 文件，代码如下：

```js

package routes

import (
	"ginblog/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

func InitRouter() {
	gin.SetMode(utils.AppMode)
	r := gin.Default()

	router := r.Group("api/vi")
	{
		router.GET("hello", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"msg": "ok",
			})
		})
	}

	r.Run(utils.HttpPort)
}
```

其中，MustString 方法里的参数是默认值。

然后编辑我们的 main.go 文件，执行 InitRouter 方法：

```js
package routes

import (
	"ginblog/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

func InitRouter() {
	gin.SetMode(utils.AppMode)
	r := gin.Default()

	router := r.Group("api/vi")
	{
		router.GET("hello", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"msg": "ok",
			})
		})
	}

	r.Run(utils.HttpPort)
}
```

然后按 build 按钮运行：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3111708d-b169-4b0f-b99c-ca700c811be3/Untitled.png)

运行结果出现下面的打印信息就表示成功啦：
