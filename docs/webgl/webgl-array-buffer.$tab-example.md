---
title: DEMO 示例
---

## 1.缓冲区对象

### 1.2 绘制多个点（相同大小）

[![](../../public/juejin.svg)](https://code.juejin.cn/pen/7406612265811902514)
![](./img/buffer-equal-size.png)
在 webgl 里所有的图形都是由顶点连接而成的，咱们就先画三个可以构成三角形的点。

### 1.2 绘制多个点（不同大小）

[![](../../public/juejin.svg)](https://code.juejin.cn/pen/7406615337510109196)

![](./img/buffer-unequal-size.png)
在【绘制多个点（相同大小）】这个例子中，points 中两个数据代表一个顶点，现在我们需要三个数据代表一个顶点，把顶点的 size 值加进去：

```js
const points = new Float32Array([-0.5, -0.5, 10, 0.5, -0.5, 20, 0.0, 0.5, 30]);
```

赋值就要多增加一个给 aPointSize 赋值的逻辑:

- vertexAttribPointer 函数的第五个参数：例如这里有 3 组数据，-0.5,-0.5,10 是第一组，0.5,-0.5,20 是第二组，0.0, 0.5, 30 是第三组，那么一组由 3 个数据组成的，因此间距就是 3，但是它这里需要传入的是字节数，因此先获取字节数，再用字节数 \* 3 即可。
- vertexAttribPointer 函数的第六个参数：代表的是数据偏移量，简单的理解为在组内从第几个数据开始读取。例如顶点数据是-0.5,-0.5,10，顶点坐标是-0.5,-0.5，顶点大小是 10，所以顶点坐标从组内的第一个数据开始读取，它没有产生偏移量，而顶点大小是从组内的第三个数据开始读取，因此它的偏移量为 2

```js
const BYTES = points.BYTES_PER_ELEMENT; // 获取数据对应的字节数

gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, BYTES * 3, 0);
gl.enableVertexAttribArray(aPosition);

gl.vertexAttribPointer(aPointSize, 1, gl.FLOAT, false, BYTES * 3, BYTES * 2);
gl.enableVertexAttribArray(aPointSize);
```

## 2.多图形绘制

### 2.1 gl.LINES 线段

[![](../../public/juejin.svg)](https://code.juejin.cn/pen/7406633605390139403)
![](./img/draw-line.png)

```js
const points = new Float32Array([-0.5, -0.5, 0.0, 0.5]);
gl.drawArrays(gl.LINES, 0, 2);
```

:::warning{title=注意}
即使 points 有三个顶点（6 个数据），drawArrays 第三个参数设置为 3。
LINES 类型它只接收两个点的数据，超过两个它会自动忽略，传了 3 也只会读取前两个。
:::

### 2.2 gl.LINE_STRIP 折线

[![](../../public/juejin.svg)](https://code.juejin.cn/pen/7406644698456653887)
![](./img/draw-line-strip.png)

```js
const points = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]);
gl.drawArrays(gl.LINE_STRIP, 0, 3);
```

### 2.3 gl.LINE_LOOP 多边形

[![](../../public/juejin.svg)](https://code.juejin.cn/pen/7406646563063201830)
![](./img/draw-line-loop.png)

```js
const points = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5]);
gl.drawArrays(gl.LINE_LOOP, 0, 3);
```

### 2.4 gl.TRIANGLES 三角形

![](./img/draw-line-triangles.png)

```js
const points = new Float32Array([
  -0.5, -0.5, 0.5, -0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.8, 0.8, 0.5,
]);
gl.drawArrays(gl.TRIANGLES, 0, 4);
```

### 2.5 gl.TRIANGLE_FAN 飘带状三角形

![](./img/draw-line-triangle-fan.png)

```js
const points = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5, 0.5, 0.5]);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
```

## 3.图形动画
