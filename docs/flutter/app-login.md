# 登陆页

涉及的内容：

- 无状态组件 → 有状态组件

## Commit 链接：

https://github.com/aojiaodemeng/rental_app/commit/38b0f9e845332ea5d6b03034de8cbbe37595f633

## 细节处理 1——路由跳转（必要时不用 push，用 replace）

```js
-Navigator.pushNamed(context, 'login') +
  Navigator.pushReplacementNamed(context, 'login');
```

## Commit 链接：

https://github.com/aojiaodemeng/rental_app/commit/aed3672ca9f063b1402833ec03284b010ebdfff0
