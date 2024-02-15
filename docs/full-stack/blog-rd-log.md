gin 框架自带了[“记录日志”](https://gin-gonic.com/zh-cn/docs/examples/write-log/)的中间件，但是会比较简单，这里使用第三方库，[logrus](https://pkg.go.dev/github.com/sirupsen/logrus)

因为它灵活性很高，可以自定义很多东西。

# 一、小改造下之前的代码

```js
func InitRouter() {
	gin.SetMode(utils.AppMode)
-	r := gin.Default()
+ r := gin.New()
+	r.Use(gin.Recovery())
	...
}
```

然后在项目根目录下新建 log 文件夹，用来存放日志文件。

# 二、自定义中间件

## 1.安装 logrus

```js
go get -u github.com/sirupsen/logrus
```

## 2.定义中间件

新建 middleware/logger.go 文件

```js
package middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/qiniu/go-sdk/v7/storage"
	"math"
	"os"
	"time"
)

func Logger() gin.HandlerFunc {
	logger := logrus.New()
	return func(c *gin.Context) {
		startTime := time.Now()
		c.Next()
		stopTime := time.Since(startTime)
		spendTime := fmt.Sprintf("%d ms", int(math.Ceil(float64(stopTime.Nanoseconds()/1000000.0))))
		hostName,err := os.Hostname()
		if err != nil {
			hostName = "unknown"
		}
		statusCode := c.Writer.Status()
		clientIp := c.ClientIP()
		userAgent := c.Request.UserAgent()   // 客户端信息
		dataSize := c.Writer.Size()
		if dataSize <0 {
			dataSize = 0
		}
		method := c.Request.Method   // 请求的方法
		path := c.Request.RequestURI  // 请求路径

		entry := logger.WithFields(logrus.Fields{
			"Hostname":hostName,
			"Status":statusCode,
			"SpendTime":spendTime,
			"Ip":clientIp,
			"Method":method,
			"Path":path,
			"DataSize":dataSize,
			"Agent": userAgent,
		})
		if len(c.Errors) > 0{
			entry.Error(c.Errors.ByType(gin.ErrorTypePrivate).String())
		}
		if statusCode >= 500 {
			entry.Error()
		}else if statusCode>=400{
			entry.Warn()
		}else{
			entry.Info()
		}
	}
}
```

## 3.引入中间件

```js
func InitRouter() {
	...
	r.Use(middleware.Logger())

}
```

## 4.测试

启动项目，然后发起一个请求，就可以在终端看到日志：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/373fc4ac-9f0f-4729-a5f6-785a624fd63f/Untitled.png)

到此，自定义中间件已经完成，下一个步骤就是将日志写进文件里。

# 三、将日志写进文件里

在 middleware/logger.go 文件里的 logger 方法添加以下代码：

```js
func Logger() gin.HandlerFunc {
	filePath := "log/log.log"
	src, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE, 0755)
	if err != nil {
		fmt.Println("err:", err)
	}
	logger := logrus.New() // 这行代码是原有的
	logger.Out = src
	return func(c *gin.Context) {
		...
	}
}
```

middleware/logger.go 文件完整的代码就是：

```js
package middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"math"
	"os"
	"time"
)

func Logger() gin.HandlerFunc {
	filePath := "log/log.log"
	src, err := os.OpenFile(filePath, os.O_RDWR|os.O_CREATE, 0755)
	if err != nil {
		fmt.Println("err:", err)
	}
	logger := logrus.New()
	logger.Out = src
	return func(c *gin.Context) {
		startTime := time.Now()
		c.Next()
		stopTime := time.Since(startTime)
		spendTime := fmt.Sprintf("%d ms", int(math.Ceil(float64(stopTime.Nanoseconds()/1000000.0))))
		hostName, err := os.Hostname()
		if err != nil {
			hostName = "unknown"
		}
		statusCode := c.Writer.Status()
		clientIp := c.ClientIP()
		userAgent := c.Request.UserAgent() // 客户端信息
		dataSize := c.Writer.Size()
		if dataSize < 0 {
			dataSize = 0
		}
		method := c.Request.Method   // 请求的方法
		path := c.Request.RequestURI // 请求路径

		entry := logger.WithFields(logrus.Fields{
			"Hostname":  hostName,
			"Status":    statusCode,
			"SpendTime": spendTime,
			"Ip":        clientIp,
			"Method":    method,
			"Path":      path,
			"DataSize":  dataSize,
			"Agent":     userAgent,
		})
		if len(c.Errors) > 0 {
			entry.Error(c.Errors.ByType(gin.ErrorTypePrivate).String())
		}
		if statusCode >= 500 {
			entry.Error()
		} else if statusCode >= 400 {
			entry.Warn()
		} else {
			entry.Info()
		}
	}
}
```

然后重新启动，然后再重新发起一个 api 请求，会发现终端不再输出日志了，而是在 log/log.log 文件里看到了日志内容。

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/64a1f4ec-630b-4007-b72c-b529c8b59c84/Untitled.png)

## 四、按时间分割日志

如果日志比较多，那么在日志文件里，我们需要对每一次的日志进行换行，也就是按时间进行分割。

这里我们要用到一个专门用来日志分割的包：

[rotatelogs](https://pkg.go.dev/github.com/lestrrat-go/file-rotatelogs)

### 1.安装依赖

```js
go get github.com/lestrrat-go/file-rotatelogs
go get github.com/rifflock/lfshook
```

### 2.分割日志

```js
func Logger() gin.HandlerFunc {

	...
	logger.Out = src

	// 加入以下代码
	logger.SetLevel(logrus.DebugLevel)
	logWriter, _ := retalog.New(
		filePath+"%Y%m%d.log",
		retalog.WithMaxAge(7*24*time.Hour),
		retalog.WithRotationTime(24*time.Hour),
	)
	writeMap := lfshook.WriterMap{
		logrus.InfoLevel:  logWriter,
		logrus.FatalLevel: logWriter,
		logrus.DebugLevel: logWriter,
		logrus.WarnLevel:  logWriter,
		logrus.ErrorLevel: logWriter,
		logrus.PanicLevel: logWriter,
	}
	Hook := lfshook.NewHook(writeMap, &logrus.TextFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
	})
	logger.AddHook(Hook)

	return func(c *gin.Context){
		...
	}
}
```

重启项目，发送一个 api 请求，会发现 log 文件夹下会出现一个以当天日期命名的 log 文件：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/13a39150-8f73-46c8-98bf-cff3dba8dac4/Untitled.png)

## 五、软连接

lfshook 这个库提供了软连接方法`WithLinkName`

middleware/logger.go 文件里增加以下两行代码：

```js

func Logger() gin.HandlerFunc {
	...
	linkName := "latest_log.log"
	...
	logWriter, _ := retalog.New(
		...
		retalog.WithLinkName(linkName),
	)

}
```

然后重启项目，发送一个 api 请求，就会在项目根目录下生成一个 latest_log.log 文件，点击它会就会自动打开最新的日志文件。

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ef415247-df35-46e3-8e50-74f5ffea7314/Untitled.png)
