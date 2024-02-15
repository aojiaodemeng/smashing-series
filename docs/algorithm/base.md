## 刷题工具

- [VisuAlgo-数据结构和算法动态可视化 (Chinese)](https://visualgo.net/zh/)
- [代码随想录](https://programmercarl.com/)
- [七天刷爆 LeetCode，顶级算法大神-【左程云】](https://www.bilibili.com/video/BV1NU4y1M7rF?p=5)
- [labuladong 的算法小抄 - github](https://github.com/labuladong/fucking-algorithm)
- [labuladong 的算法小抄 - website](https://labuladong.online/algo/)

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

举个 🌰：在算法流程中实际发生了`{aN^{2}+bN+c}`次常数操作，时间复杂度则为`{O(N^{2})}`

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

如果只需要有限个变量就可以完成算法，则空间复杂度为`O(1)`，如果必须开辟一个数组，则空间复杂度为`O(n)`

## Q1:如果一段代码中有 3 个循环，它们的循环次数都是 n，那么这段代码的时间复杂度是 O(3n) 还是 O(n)？

答：

- 循环并列，时间复杂度 O(n)
- 循环嵌套，时间复杂度 O(n^3)

## Q2:假设每天睡觉前，你都会数 2 的次方，1、2、4、8⋯⋯，每次你都数到 n 才睡着，那么你数了几个数？时间复杂度是多少？

答：O(n)

## 稳定性

同样值的个体之间，如果不因为排序而改变相对次序，就是这个排序是有稳定性的；否则就没有。
比如[1,4,5,4]排序之后就是[1,4,4,5]，对于两个 4，如果还是保持之前的顺序，那就是有稳定性。

### 什么时候需要稳定性？

假设现在有一堆学生的数据，每个学生有两个字段：class 班级和 age 年龄。首先我们按年龄进行排序，排序之后再按班级排序，第二次排序是稳定的，那么每个班级里的学生都是按年龄排序的。稳定性就是保持相同值之间的相对次序。在实际的一些处理场景中还是很有用的。

## 比较器

比较器在 C++里叫`重载比较运算符`，改写比较的规则（改写什么叫大于号，什么叫小于号）

在 Java 中叫`比较器`，Java 中的对象，正常情况下，只能进行比较：==或!=，不能使用>或<，但是在开发场景中，我们需要对多个对象进行排序，言外之意，就需要比较对象的大小，如何实现呢？这就需要使用`Comparable接口`（若一个类实现了 Comparable 接口，就意味着“该类支持排序”， 作用在实体类上， 同时也被称之为内部比较器）或`Compartor接口`（我们若需要控制某个类的次序，可以建立一个“该类的比较器”来进行排序，作用在排序类上，同时也被称之为外部比较器）。

- 比较器的实质就是重载比较运算符
- 比较器可以很好的应用在特殊标准的排序上
- 比较器可以很好的应用在根据特殊标准排序的结构上

### 比较器的默认规则

- 返回负数的时候，第一个参数排在前面
- 返回正数的时候，第二个参数排在前面
- 返回 0 的时候，谁在前面无所谓

### java 中的示例

举个例子：现在有一堆学生数据，我们需要对其进行排序，排序规则就是按 id 升序。

```java
// 定义一个升序比较器
public static class IdAscendingComparator inplements Comparator<Student>{
      public int compare(Student o1, Student O2){
          // if(o1.id < o2.id) return -1;
          // if(o1.id > o2.id) return 1;
          // return 0;
          // 上述三行代码可以简写成：
          return o1.id - o2.id
      }
}

Student student1 = new Student("A", 2, 20);  // 三个参数分别代表name，id，age
Student student2 = new Student("B", 3, 21);
Student student3 = new Student("C", 1, 22);

Student[] students = new Student[]{student1, student2, student3}
Array.sort(student, new IdAscendingComparator());  // 第二个参数就是比较规则
```

### javascript 中的示例

当我们想把一个由数字组成的数组进行简单的排序时，可能会想到 sort()方法：

```js
var arr = [2, 3, -1, -107, -14, 1];

console.log(arr.sort()); // 输出[-1, -107, -14, 1, 2, 3];
```

这样显然是有问题的，因为调用该方法时没有使用参数，将按字母顺序对数组中的元素进行排序，也就是按照字符编码的顺序进行排序。

所以我们需要一个比较器：

```js
console.log(
  arr.sort(function (a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }),
);
```

输出结果：

```js
[-107, -14, -1, 1, 2, 3];
```

这样子看起来就好多了~所以我们在使用 sort()方法对数组进行排序时要注意它的规则。

### 定义升序的比较器

```js
var arr = [2, 23, 3, 226, 123, 1, 12];
//Step1:定义比较器函数
function compareASC(a, b) {
  return a - b;
}
//Step2:将函数作为参数传入sort方法
arr.sort(compareASC);
```

### 定义降序的比较器

```js
function compareDESC(a, b) {
  return b - a;
}
arr.sort(compareDESC);
```

### 相关链接

对于比较器，叫法或应用大同小异，可以看相关链接进行了解：  
[C++  重载运算符和重载函数-菜鸟教程](https://www.runoob.com/cplusplus/cpp-overloading.html)
