## 题目 1:实现一个并发控制的异步调度器 Scheduler

实现一个带并发限制的异步调度器 Scheduler，保证同时运行的任务最多有 2 个。
完善下面代码中的 Scheduler 类，使得以下程序能正确输出（注意有些面试官不会给下面的题目框架，要自己从 0 开始完成题目要求）：

```js
class Scheduler {
  add(promiseCreator) { ... }
  // ...
}

const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

const scheduler = new Scheduler()
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

// 打印顺序是：2 3 1 4
```

### 分析打印结果

- 其实 1、2 两个任务开始执行
- 500ms 时，2 任务执行完毕，输出 `2`，任务 3 开始执行
- 800ms 时，3 任务执行完毕，输出 `3`，任务 4 开始执行
- 1000ms 时，1 任务执行完毕，输出 `1`，此时只剩下 4 任务在执行
- 1200ms 时，4 任务执行完毕，输出 `4`

### 解题思路

- Promise 依序进行执行，可以使用队列先进先出的特性

### step1.定义几个基础变量

- `queue`:用来存储`promiseCreator`
- `n`：最大并行个数，此题是 2
- `add函数`：作用是往队列中插入`Promise Generator函数`
- `curCount`：当前正在执行的 Promise 个数

```js
class Scheduler {
  constructor(n) {
    this.n = n;
    this.queue = [];
    this.curCount = 0;
  }
  add(promiseCreator) {
    this.queue.push(promiseCreator);
  }
}
```

### step2.定义新函数`request`

函数作用：每次从队列中取出 Promise Generator 并执行，此 Promise 执行完成之后应该调用递归调用 request 函数做到执行下一个 Promise。

```js
request(){
    if(!this.queue || !this.queue.length || this.curCount>=this.n) return
    this.curCount++;
    this.queue.shift()().then(()=>{
      this.curCount--;
      this.request()
    })
  }
```

### step3.定义新函数`taskStart`

启动函数，将 2 个 Promise 启动起来

```js
taskStart() {
    for (let i = 0; i < this.n; i++) {
      this.request();
    }
}
```

### 完整代码

```js
class Scheduler {
  constructor(n) {
    this.n = n;
    this.queue = [];
    this.curCount = 0;
  }
  add(promiseCreator) {
    this.queue.push(promiseCreator);
  }
  taskStart() {
    for (let i = 0; i < this.n; i++) {
      this.request();
    }
  }
  request() {
    if (!this.queue || !this.queue.length || this.curCount >= this.n) return;
    this.curCount++;
    this.queue
      .shift()()
      .then(() => {
        this.curCount--;
        this.request();
      });
  }
}

const scheduler = new Scheduler(2);

function addTask(time, order) {
  // 这里用原题中的timeout，一行代码搞定：scheduler.add(() => timeout(time)).then(() => console.log(order))
  const task = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    }).then(() => console.log(order));
  scheduler.add(task);
}

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');
scheduler.taskStart();
```

## 题目 2: [LeetCode-2636.Promise 对象池](https://leetcode.cn/problems/promise-pool/description/)

- [Promise 对象池](https://blog.csdn.net/bu_leng/article/details/131204325)

### 题目描述

请你编写一个异步函数 promisePool ，它接收一个异步函数数组 functions 和 池限制 n。它应该返回一个 promise 对象，当所有输入函数都执行完毕后，promise 对象就执行完毕。

池限制 定义是一次可以挂起的最多 promise 对象的数量。promisePool 应该开始执行尽可能多的函数，并在旧的 promise 执行完毕后继续执行新函数。promisePool 应该先执行 functions[i]，再执行 functions[i + 1]，然后执行 functions[i + 2]，等等。当最后一个 promise 执行完毕时，promisePool 也应该执行完毕。

例如，如果 n = 1 , promisePool 在序列中每次执行一个函数。然而，如果 n = 2 ，它首先执行两个函数。当两个函数中的任何一个执行完毕后，再执行第三个函数(如果它是可用的)，依此类推，直到没有函数要执行为止。

你可以假设所有的 functions 都不会被拒绝。对于 promisePool 来说，返回一个可以解析任何值的 promise 都是可以接受的。

示例 1：

```js
输入：
functions = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
]
n = 2
输出：[[300,400,500],500]
解释
传递了三个函数。它们的睡眠时间分别为 300ms、 400ms 和 200ms。
在 t=0 时，执行前两个函数。池大小限制达到 2。
当 t=300 时，第一个函数执行完毕后，执行第3个函数。池大小为 2。
在 t=400 时，第二个函数执行完毕后。没有什么可执行的了。池大小为 1。
在 t=500 时，第三个函数执行完毕后。池大小为 0，因此返回的 promise 也执行完成。
```

示例 2：

```js
输入：
functions = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
]
n = 5
输出：[[300,400,200],400]
解释：
在 t=0 时，所有3个函数都被执行。池的限制大小 5 永远不会满足。
在 t=200 时，第三个函数执行完毕后。池大小为 2。
在 t=300 时，第一个函数执行完毕后。池大小为 1。
在 t=400 时，第二个函数执行完毕后。池大小为 0，因此返回的 promise 也执行完成。

```

示例 3：

```js
输入：
functions = [
  () => new Promise(res => setTimeout(res, 300)),
  () => new Promise(res => setTimeout(res, 400)),
  () => new Promise(res => setTimeout(res, 200))
]
n = 1
输出：[[300,700,900],900]
解释：
在 t=0 时，执行第一个函数。池大小为1。
当 t=300 时，第一个函数执行完毕后，执行第二个函数。池大小为 1。
当 t=700 时，第二个函数执行完毕后，执行第三个函数。池大小为 1。
在 t=900 时，第三个函数执行完毕后。池大小为 0，因此返回的 Promise 也执行完成。

```

提示：

- 0 <= functions.length <= 10
- 1 <= n <= 10

### 网友答案

```js
var promisePool = async function (functions, n) {
  // 使用 Set 存储正在执行的任务队列
  let queue = new Set();
  let resolved = [];

  for (const task of functions) {
    // 将正在执行的任务加入到队列中
    const x = task().then((res) => {
      // 任务执行完成后将结果存到 resolved 数组中
      resolved.push(res);
      // 完成后移出正在执行队列
      queue.delete(x);
    });
    queue.add(x);
    // 控制线程池执行最大数
    if (queue.size >= n) {
      await Promise.race(queue);
    }
  }
  // 执行完所有任务后才返回执行结果
  await Promise.allSettled(queue);
  return resolved;
};

const sleep = (t) =>
  new Promise((res) => setTimeout(res, t)).then(() => console.log(t));
promisePool([() => sleep(500), () => sleep(400)], 1); // After 900ms
```

### 跟上题一样的思路

```js
var promisePool = async function (functions, n) {
  let curCount = 0;
  const queue = functions;
  function request() {
    if (!queue || !queue.length || curCount >= n) return;
    curCount++;

    queue
      .shift()()
      .then(() => {
        curCount--;

        request();
      });
  }
  for (let i = 0; i < n; i++) {
    request();
  }
};

// 以下是测试用例
const sleep = (t) =>
  new Promise((res) => setTimeout(res, t)).then(() => console.log(t));
promisePool(
  [() => sleep(1000), () => sleep(500), () => sleep(300), () => sleep(400)],
  2,
); // After 900ms
```
