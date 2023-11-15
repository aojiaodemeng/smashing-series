# 十二、构建打包之 ios 打包

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2810afd5-745c-403e-ba99-71feba3c0e64/9d4fc4e4-3676-48fd-992f-1cf50c2964b5/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2810afd5-745c-403e-ba99-71feba3c0e64/4d905a95-aa0b-4751-bf1c-0fac2b322878/Untitled.png)

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2810afd5-745c-403e-ba99-71feba3c0e64/0c7a5375-fac0-44f5-b2a8-e8560437eb0e/Untitled.png)

## step1:修改应用名称

修改/ios/Runner/info.plist 文件里的 CFBundleName 对应值

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2810afd5-745c-403e-ba99-71feba3c0e64/1dc32c28-dd6e-4251-98dc-9d9fed9bccf4/Untitled.png)

## step2:修改图标和背景图

替换 Assets.xcassets 文件即可，这里没有视频中提到的现有静态资源，就不操作了。

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2810afd5-745c-403e-ba99-71feba3c0e64/0f3c3eac-4cd8-4b79-ba7a-df3a9c719360/Untitled.png)

## step3:构建

```js
flutter build ios
```

构建成功之后，build 文件夹下的 iphoneos/Runner.app 就是打包之后的文件。
