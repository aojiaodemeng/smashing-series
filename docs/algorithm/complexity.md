# 复杂度

## 时间复杂度

### 什么是常数操作

> 常数时间的操作：一个操作如果和样本的数据量没有关系，每次都是固定时间内完成的操作，叫做常数操作。

以下为常数操作：

```
int a = arr[i]   //数组中寻址
+ - * /          //加减乘除
```

以下不是常数操作：

```
int a = list.get(i) // 这是链表结构，需要逐个遍历，跟list数据量有关
```

### 时间复杂度的定义

时间复杂度是衡量常数操作数量的一个指标。即算出算法流程中发生了多少常数操作，进而总结出常数操作数量的表达式。

> 注意表达式中只要高阶项，不要低阶项，也不要高阶项的系数。

举个 🌰：在算法流程中实际发生了${aN^{2}+bN+c}$次常数操作，时间复杂度则为${O(N^{2})}$

```js
// O(1)
let i = 0;
i += 1;

// O(n)
for (let i = 0; i < n; i += 1) {
  console.log(i);
}

// O(1)+O(n)=O(n)
let i = 0;
i += 1;
for (let i = 0; i < n; i += 1) {
  console.log(i);
}

// O(n)*O(n)=O(n^2)
for (let i = 0; i < n; i += 1) {
  for (let j = 0; j < n; j += 1) {
    console.log(i, j);
  }
}

// O(logN)
let i = 1;
while (i < n) {
  console.log(i);
  i *= 2;
}
```

评级一个算法流程的好坏，先看时间复杂度的指标，如果指标无法区分出，就直接用真实数据进行测试。

## 空间复杂度

如果只需要有限个变量就可以完成算法，则空间复杂度为$O(1)$，如果必须开辟一个数组，则空间复杂度为$O(n)$

## Q1:如果一段代码中有 3 个循环，它们的循环次数都是 n，那么这段代码的时间复杂度是 O(3n) 还是 O(n)？

答：

- 循环并列，时间复杂度 O(n)
- 循环嵌套，时间复杂度 O(n^3)

## Q2:假设每天睡觉前，你都会数 2 的次方，1、2、4、8⋯⋯，每次你都数到 n 才睡着，那么你数了几个数？时间复杂度是多少？

答：O(n)

# 简单排序算法

## 选择排序

思路：

- 找到数组中的最小值，选中它并将其放置在第一位
- 接着找到第二小的值，选中它并将其放置在第二位
- 以此类推，执行 n-1 轮

```js
Array.prototype.selectionSort = function () {
  for (let i = 0; i < this.length - 1; i++) {
    let minIndex = i;
    for (let j = i; j < this.length; j++) {
      if (this[j] < this[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      const temp = this[i];
      this[i] = this[minIndex];
      this[minIndex] = temp;
    }
  }
};

const arr = [5, 7, 3, 2, 1];
arr.selectionSort();
```

时间复杂度为$O(N^2)$，空间复杂度为$O(1)$
[代码片段](https://code.juejin.cn/pen/7087242499416129572)

## 冒泡排序

思路：

- 比较所有相邻元素，如果第一个比第二个大，则交换它们
- 一轮下来，可以保证最后一个数是最大的（第一轮确定了第 n 位置的数，第二轮确定了第 n-1 位置的数）
- 执行 n-1 轮，就可以完成排序

```js
Array.prototype.bubbleSort = function () {
  for (let i = this.length; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (this[j] > this[j + 1]) {
        let temp = this[j];
        this[j] = this[j + 1];
        this[j + 1] = temp;
      }
    }
  }
};
const arr = [5, 4, 3, 2, 1];
arr.bubbleSort();
```

时间复杂度为$O(N^2)$，空间复杂度为$O(1)$

## 插入排序

思路：

- 从第二个数开始**往前比**
- 比它大就**往后排**
- 以此类推进行到最后一个数，从而依次确定 0，1，2...位置的数

特殊：根据数据的不同，实际的常数操作次数不同。不过时间复杂度是按最差情况估计，所以说插入排序的时间复杂度为$O(N^2)$。

```js
Array.prototype.insertSort = function () {
  for (let i = 1; i < this.length; i++) {
    for (let j = i - 1; j >= 0 && this[j] > this[j + 1]; j--) {
      console.log(this[j]);
      const temp = this[j];
      this[j] = this[j + 1];
      this[j + 1] = temp;
    }
  }
};

const arr = [5, 4, 3, 2, 1];
arr.insertSort();
```

时间复杂度为$O(N^2)$，空间复杂度为$O(1)$

工具：  
[VisuAlgo-数据结构和算法动态可视化 (Chinese)](https://visualgo.net/zh/)

## 二分搜索

思路：

- 从数组中间元素开始，如果中间元素正好是目标值，则搜索结束
- 如果目标值大于或小于中间元素，则在大于或小于中间元素的那一半数组中搜索

时间复杂度为$O(\log{N})$，即$O(\log_2{N})$（每次比较都使搜索范围缩小一半），空间复杂度为$O(1)$

### 二分法的扩展

- 在一个有序数组中，找某个数是否存在
- 在一个有序数组中，找>=某个数最左侧的位置
- 局部最小值问题
  例如：在一个无序数组 arr 中，任意两个相邻的数不相等，求一个局部最小的位置，要求时间复杂度为$O(N)$

## 归并排序

总体思路：

- 分：把数组分为两个部分，再递归的对子数组进行“分”操作，直到分成一个个单独的数
- 合：把两个数合并为有序数组，再对有序数组进行合并，直到全部子数组合并为一个完整数组
  合并的思路：
- 新建一个空数组 res，用于存放最终排序后的数组
- 比较两个有序数组的头部，较小者出队并推入 res 中
- 如果有两个数组还有值，重复上一步骤

### js 版本的实现

```js
Array.prototype.mergeSort = function () {
  const rec = (arr) => {
    if (arr.length === 1) {
      return arr;
    }
    const mid = arr.length >> 1;
    const left = arr.slice(0, mid);
    const right = arr.slice(mid, arr.length);
    const orderLeft = rec(left);
    const orderRight = rec(right);
    const res = [];
    while (orderLeft.length || orderRight.length) {
      if (orderLeft.length && orderRight.length) {
        res.push(
          orderLeft[0] < orderRight[0] ? orderLeft.shift() : orderRight.shift(),
        );
      } else if (orderLeft.length) {
        res.push(orderLeft.shift());
      } else if (orderRight.length) {
        res.push(orderRight.shift());
      }
    }
    return res;
  };
  const res = rec(this);
  res.forEach((n, i) => {
    this[i] = n;
  });
};

const arr = [5, 7, 3, 2, 1];
arr.mergeSort();
```

### 左神版本的实现

```java
public static void process(int[] arr, int L, int R){
    if(L==R){
        return;
    }
    int mid = L+((R-L)>>1);
    process(arr, L,mid);
    process(arr, mid+1,R);
    merge(arr,L,mid,R);
}

public static void merge(int[] arr, int L, int M, int R){
    int[] help=new int[R-L+1];
    int i = 0;
    int p1=L;
    int p2=M+1;
    while(p1<=M &&p2<=R){
        help[i++]=arr[p1]<=arr[p2]?arr[p1++]:arr[p2++];
    }
    while(p1<=M){
        help[i++]=arr[p1++];
    }
    while(p2<=R){
        help[i++]=arr[p2++];
    }
    for(i=0;i<help.length;i++){
        arr[L+i]=help[i];
    }
}
```

总的时间复杂度为$O(n*log{N})$（分的时间复杂度为$O(log{N})$，合的时间复杂度是$O(n)$）；空间复杂度为$O(N)$
[代码片段](https://code.juejin.cn/pen/7087890047269077004)
