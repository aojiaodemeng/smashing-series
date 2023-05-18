# 与运算

## 认识&

& 按位与操作，按二进制位进行"与"运算。运算规则：（有 0 则为 0）

- 0 & 0 = 0;
- 0 & 1 = 0;
- 1 & 0 = 0;
- 1 & 1 = 1;

## -x 的含义 与 x & (-x)

-x 的值， 其实就是在 x 的值的基础上进行按位取反(~x)之后在增加 1 所得，即$x & -x == x & (~x + 1)$

### x 为偶数

```js
x = 0000 0100 1110   // 假设x为偶数，比如0000 0100 1110
～x = 1111 1011 0001 // 取反后就是1111 1011 0001
～x+1 = 1111 1011 0001 + 1 = 1111 1011 0010   // 再加1就等于1111 1011 0010

x & (~x + 1) = 0000 0000 0010        //x & (-x)的结果就是0000 0000 0010
```

### x 为奇数

```js
x = 0000 0100 1111    // 假设x为奇数，比如 0000 0100 1111
～x = 1111 1011 0000  // 取反后为1111 1011 0000
～x+1 = 1111 1011 0001 //由于～x的值一定是偶数，因此加1时必不会产生进位
x & (~x + 1) = 0000 0000 0001  // x & (~x + 1)结果就是 0000 0000 0001，最后一位必定为1，其他位必定为0
```

> 结论：
>
> - x 为偶数，$x & (-x)$的二进制表达式只会有一位保留为 1
> - x 为奇数，$x & (-x)$的二进制表达式最后一位必定为 1，其它为 0
> - x 为 0 时，$x & (-x)$的二进制表达式为 0
>   $x & (-x)$ 一般是用来获取某个二进制数的最低位的 1 所对应的值

# 异或运算

运算符号为：⊕（代码中就是^）。

> 如果 a、b 两个值不相同，则异或结果为 1；如果值相同，则为 0
> 用 1 表示真，0 表示假，则异或运算法则为：0⊕0=0，0⊕1=1，1⊕0=1，1⊕1=0。

异或运算也被常称为不进位加法：
10110⊕00111=10001

## 性质

- 满足交换律、结合律
- 0⊕a=a、a⊕a=0 (注意 1⊕a!=a)

## 异或运算在计算机中的应用

举个 🌰——交换值：

```js
int a = 甲
int b = 乙
a=a⊕b;   //a=甲⊕乙，b=乙
b=a⊕b;   //a=甲⊕乙，b=甲⊕乙⊕乙=甲⊕0=甲
a=a⊕b;   //a=甲⊕乙⊕甲=0⊕乙=乙，b=甲
```

> 注意：能用这个方式的前提是，a 与 b 所指向的是不同的内存。

## LeetCode 中奇妙的异或运算

### [LeetCode-136. 只出现一次的数字](https://leetcode-cn.com/problems/single-number/)

```js
var singleNumber = function (nums) {
  let xor = 0;
  for (let i = 0; i < nums.length; i++) {
    console.log(i);
    xor ^= nums[i];
  }
  console.log(1 ^ 87, 0 ^ 87);
  return xor;
};
```

#### 题目变形

给定一个**非空**整数数组，除了某个元素只出现奇数次以外，其余每个元素均出现偶数次。找出那个只出现了奇数次的元素。要求时间复杂度为$O(N)$，空间复杂度为$O(1)$

> 思路：0 逐个对数组中的元素进行异或，最后剩下的数就是只出现奇数次的元素（由于出现偶数次的数异或后就是 0）

### [LeetCode-260. 只出现一次的数字 III](https://leetcode-cn.com/problems/single-number-iii/)

```js
var singleNumber = function (nums) {
  let eor = 0;
  for (let i = 0; i < nums.length; i++) {
    eor ^= nums[i];
  }
  let rightOne = eor & -eor;
  let type1 = 0;
  let type2 = 0;
  for (const num of nums) {
    if (num & rightOne) {
      type1 ^= num;
    } else {
      type2 ^= num;
    }
  }
  return [type1, type2];
};
```

#### 题目变形

给定一个**非空**整数数组，有两个元素出现奇数次，其余每个元素均出现偶数次。找出只出现了奇数次的元素。要求时间复杂度为$O(N)$，空间复杂度为$O(1)$

> - 思路：假设出现奇数次的两个元素是 x 和 y，那么 0 逐个对数组中的元素进行异或的结果为 eor（eor=x^y，且 eor 不为 0，eor 必然有一个位置上为 1，假设这个位置为 k，那么在 k 位，x 和 y 不相同）；找到 eor 中为 1 的某一位，假设为第 k 位，按 k 是否为 1 将所有元素分为两组，这样的话，x 和 y 分别位于不同组中；不同组中对子元素进行异或，最后结果分别就是 x 和 y
> - 难点：如何找到 eor 中最右为 1 的位置

# 有关于位元算的题目

[136. 只出现一次的数字](https://leetcode-cn.com/problems/single-number/)  
[137. 只出现一次的数字 II](https://leetcode-cn.com/problems/single-number-ii/)  
[260. 只出现一次的数字 III](https://leetcode-cn.com/problems/single-number-iii/)  
[剑指 Offer II 004. 只出现一次的数字](https://leetcode-cn.com/problems/WGki4K/)  
[剑指 Offer 15. 二进制中 1 的个数](https://leetcode-cn.com/problems/er-jin-zhi-zhong-1de-ge-shu-lcof/)  
[190. 颠倒二进制位](https://leetcode-cn.com/problems/reverse-bits/)  
[191. 位 1 的个数](https://leetcode-cn.com/problems/number-of-1-bits/)  
[231. 2 的幂](https://leetcode-cn.com/problems/power-of-two/)  
[338. 比特位计数](https://leetcode-cn.com/problems/counting-bits/)  
[342. 4 的幂](https://leetcode-cn.com/problems/power-of-four/)  
[371. 两整数之和](https://leetcode-cn.com/problems/sum-of-two-integers/)  
[405. 数字转换为十六进制数](https://leetcode-cn.com/problems/convert-a-number-to-hexadecimal/)  
[461. 汉明距离](https://leetcode-cn.com/problems/hamming-distance/)  
[476. 数字的补数](https://leetcode-cn.com/problems/number-complement/)  
[477. 汉明距离总和](https://leetcode-cn.com/problems/total-hamming-distance/)  
[526. 优美的排列](https://leetcode-cn.com/problems/beautiful-arrangement/)  
[1178. 猜字谜](https://leetcode-cn.com/problems/number-of-valid-words-for-each-puzzle/)  
[1711. 大餐计数](https://leetcode-cn.com/problems/count-good-meals/)
