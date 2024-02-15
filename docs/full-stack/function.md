## 作用域

## 闭包

for range

## 如何消除过多的 if...else

下面给一个例子：

```go
func doSomething() error{
  if successConditional1{
    // 成功逻辑1
    ...
    if successConditional2{
       // 成功逻辑2
      ...
      return nil
    }else{
      // 错误逻辑2
      ...
      return err2
    }
  }else{
    // 错误逻辑1
    ...
    return err1
  }
}
```

可以优化如下：

```go
func doSomething() error{
  if errorConditional1{
    // 错误逻辑1
    ...
    return err1
  }
  // 成功逻辑
  ...
  if errorConditional2{
     // 错误逻辑2
    ...
    return err2
  }
  // 成功逻辑
  ...
  return nil
}

```

## defer

### defer 的运作机制

### defer 拦截 panic

### 输出调试信息

### 还原变量旧值

### defer 必知 1—明确哪些函数可作为 deferred 函数

在 defer 能够提高我们的函数简洁度情况下，大部分 Gopher 喜欢使用 defer，但在使用它之前，我们需要了解一些它的几个关键点。
首先需要明确哪些函数可以作为 deferred 函数。
