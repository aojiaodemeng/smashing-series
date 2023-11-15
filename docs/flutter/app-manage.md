# 六、设置页/房屋管理发布页

# 设置页

效果：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b0ad83f7-c1f2-477a-88ee-e9282d7af9ef/Untitled.png)

## step1: 引入 fluttertoast

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/89bad16b-2a7e-45cf-af93-cf8b44679de0/Untitled.png)

# 房屋管理发布页

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/08a8d727-bd5c-4f52-a62a-331c9fbeb8b8/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/62ee2cf1-9a36-4cd3-8dd8-14abfa813799/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/60c2b638-bb6b-42d1-8331-241b73ec0dd2/Untitled.png)

## CommonPicker

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/57425c67-eeb6-4e23-8103-7fa567039be3/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2c8773a4-5579-4c4c-82d9-bd0ebc833437/Untitled.png)

## CommonImagePicker

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/89f241fc-32ab-4688-a369-191ff47b6d28/Untitled.png)

使用 [image_picker 库](https://github.com/flutter/packages/tree/main/packages/image_picker/image_picker)

注意，这里进行一些配置：需要获取相册权限等，才能访问模拟器内部的相册系统：

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8614a586-5e86-4902-9a49-b01fcc6e0516/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/970ffc15-08ec-40c2-987b-a0d4ca0d3a3b/Untitled.png)

## Icon 的引入

- 准备 ttf 文件
- 在`pubspec.yaml`文件引入

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/81770370-f2e9-4d55-a290-466e81bc8737/Untitled.png)

- 使用

```js

Icon(IconData(0xe918,fontFamily: 'CommonIcon'), size: 40),

// '0xe918':svg 中的 unicode
```
