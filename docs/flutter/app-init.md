# 环境搭建

可参照[Flutter 文档](https://flutter.cn/)

- **1.下载 Flutter SDK**
  按照[官网-macOS install](https://docs.flutter.dev/get-started/install/macos)步骤下载 Flutter SDK
- **2.解压文件**
  下载之后将压缩包解压到目标文件夹，例如想要将 Flutter 安装在 development 这个文件夹下，那么就可以如此操作：

  ```
  cd ~/development
  unzip ~/Downloads/flutter_macos_3.10.1-stable.zip

  ```

- **3.配置 PATH**
  这一步目的是让系统能找到 Flutter 命令，这样我们就可以全局调用 flutter 命令了。
  bash 时，环境变量配置在用户目录   **.bash_profile**  下，使用 zsh 时，环境变量配置在用户目录   **.zshrc**  文件下，输入以下对应命令进入编辑模式：

  ```
  vim ~/.bash_profile    // bash
  vim ~/.zshrc           // zsh

  ```

  然后配置 PATH：

  ```
  export PATH="$PATH:`pwd`/flutter/bin"

  ```

- **4.配置依赖源**
  Flutter 为国内开发者提供了临时的镜像服务，访问速度更快（配置文件同上）。

  ```
  export PUB_HOSTED_URL=https://pub.flutter-io.cn
  export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn

  ```

- **5.执行`flutter doctor`检测命令**
  如果有出现 ❌ 的，就逐一处理。
- **6.安装开发工具、模拟器，配置编辑器**
  - 安装**Android Studio**、 Android 模拟器（IOS 环境安装 XCode）
  - IDE 安装 Flutter 扩展插件
- **7.按照官网创建项目**

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/2810afd5-745c-403e-ba99-71feba3c0e64/53e9d957-234d-48bc-bcdd-ed26c09704a9/Untitled.png)

## 启动项目

打开 VSCode，然后点击菜单“查看”-“命令面板”-“Flutter：Lunch Emulator”，再点击菜单“运行”-“启动调试”。

##
