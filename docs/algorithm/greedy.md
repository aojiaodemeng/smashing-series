## 贪心算法

- 贪心算法是`算法设计`中的一种方法
- 期盼通过每个阶段的`局部最优`选择，从而达到全局的最优
- 结果并`不一定最优`
- 比如零钱兑换、天龙八部-玲珑棋局

### 力扣 455. 分饼干

[力扣链接](https://leetcode-cn.com/problems/assign-cookies/)

:::success{title=解题思路}

- 局部最优：既能满足孩子，还消耗最少
- 先将“较小的饼干”分给“胃口最小”的孩子
  :::

:::success{title=解题步骤}

- 1.对饼干数组和胃口数组升序排序
- 2.遍历饼干数组，找到能满足第一个孩子的饼干
- 3.然后继续遍历饼干数组，找到满足第二、三、...、n 个孩子的饼干
  :::

#### JS 版本

```js
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function (g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let i = 0;
  for (let j = 0; j < s.length && i < g.length; j++) {
    if (s[j] >= g[i]) {
      i++;
    }
  }
  return i;
};
```

:::warning{title=复杂度}
时间复杂度—— O(N*logN) + O(N) = O(N*logN)，排序：O(N\*logN)，遍历：O(N)
空间复杂度—— O(1)
:::

#### GO 版本

```go
func findContentChildren(g []int, s []int) int {
    sort.Ints(g)
    sort.Ints(s)
    var i = 0
    for j:=0;i<len(g)&&j<len(s);j++{
        if(s[j]>=g[i]){
            i++
        }
    }
    return i
}
```

### 力扣 LCR 103. 零钱兑换

[力扣链接](https://leetcode.cn/problems/gaM7Ch/description/)

### 力扣 322. 零钱兑换

[力扣链接](https://leetcode.cn/problems/coin-change/description/)

### 力扣 518. 零钱兑换 II

[力扣链接](https://leetcode.cn/problems/coin-change-ii/description/)

### 力扣 121. 买卖股票的最佳时机

[力扣链接](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/description/)

### 力扣 122. 买卖股票的最佳时机 II

[力扣链接](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/)
