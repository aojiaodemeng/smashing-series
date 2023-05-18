# 比较器的概念

比较器在 C++里叫`重载比较运算符`，改写比较的规则（改写什么叫大于号，什么叫小于号）

在 Java 中叫`比较器`，Java 中的对象，正常情况下，只能进行比较：==或!=，不能使用>或<，但是在开发场景中，我们需要对多个对象进行排序，言外之意，就需要比较对象的大小，如何实现呢？这就需要使用`Comparable接口`（若一个类实现了 Comparable 接口，就意味着“该类支持排序”， 作用在实体类上， 同时也被称之为内部比较器）或`Compartor接口`（我们若需要控制某个类的次序，可以建立一个“该类的比较器”来进行排序，作用在排序类上，同时也被称之为外部比较器）。

- 比较器的实质就是重载比较运算符
- 比较器可以很好的应用在特殊标准的排序上
- 比较器可以很好的应用在根据特殊标准排序的结构上

# 比较器的默认规则

- 返回负数的时候，第一个参数排在前面
- 返回正数的时候，第二个参数排在前面
- 返回 0 的时候，谁在前面无所谓

# java 中的示例

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

# javascript 中的示例

当我们想把一个由数字组成的数组进行简单的排序时，可能会想到 sort()方法：

```
var arr = [2 , 3, -1, -107, -14, 1];

console.log(arr.sort())
```

结果：

```
[-1, -107, -14, 1, 2, 3]
```

这样显然是有问题的，因为调用该方法时没有使用参数，将按字母顺序对数组中的元素进行排序，也就是按照字符编码的顺序进行排序。

所以我们需要一个比较器：

```
console.log(arr.sort(function(a,b){
        if(a<b){
            return -1;
        }
        if(a>b){
            return 1;
        }
        return 0;
    }))
```

结果：

```
[-107, -14, -1, 1, 2, 3]
```

这样子看起来就好多了~所以我们在使用 sort()方法对数组进行排序时要注意它的规则。

## 定义升序的比较器

```js
var arr = [2, 23, 3, 226, 123, 1, 12];
//Step1:定义比较器函数
function compareASC(a, b) {
  return a - b;
}
//Step2:将函数作为参数传入sort方法
arr.sort(compareASC);
```

## 定义降序的比较器

```js
function compareDESC(a, b) {
  return b - a;
}
arr.sort(compareDESC);
```

# 相关链接

对于比较器，叫法或应用大同小异，可以看相关链接进行了解：  
[C++  重载运算符和重载函数-菜鸟教程](https://www.runoob.com/cplusplus/cpp-overloading.html)
