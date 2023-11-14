## 切片

切片有三个字段：

- array：指向切片底层数组中某元素的指针，该指针是切片的起始元素
- len：元素个数，即切片长度
- cap：切片的最大容量，即切片可以存多少元素 ，cap>=len，可选值，若不设置，则默认 cap=len

## make 和 new 的区别

使用指针时，如果指针未分配内存空间，直接使用会出现 panic 错误：

```go
var a *int64
*a = 10    // panic: runtime error: invalid memory address or nil pointer dereference
```

此时，就需要 new 函数，通过 new 对其分配内存：

```go
var a *int64 = new(int64)
*a = 1   // 正常
```

### new 内置函数

语法如下：

```go
func new(Type) *Type
```

- new 函数只有一个参数，即类型 type
- new 函数返回一个指向该类型内存地址的指针，即类型指针\*Type

但是如果是引用类型的数据，比如 array、slice、map、channel，new 内置函数是否还是通用？

```go
func main() {
   // 数组
   array := new([5]int64)
   fmt.Printf("array: %p %#v \n", &array, array) // array: 0xc0000ae018 &[5]int64{0, 0, 0, 0, 0}
   (*array)[0] = 1
   fmt.Printf("array: %p %#v \n", &array, array) // array: 0xc0000ae018 &[5]int64{1, 0, 0, 0, 0}

   // 切片
   slice := new([]int64)
   fmt.Printf("slice: %p %#v \n", &slice, slice) // slice: 0xc0000ae028 &[]int64(nil)
   (*slice)[0] = 1
   fmt.Printf("slice: %p %#v \n", &slice, slice) // panic: runtime error: index out of range [0] with length 0

   // map
   map1 := new(map[string]string)
   fmt.Printf("map1: %p %#v \n", &map1, map1) // map1: 0xc00000e038 &map[string]string(nil)
   (*map1)["key"] = "value"
   fmt.Printf("map1: %p %#v \n", &map1, map1) // panic: assignment to entry in nil map

   // channel
   channel := new(chan string)
   fmt.Printf("channel: %p %#v \n", &channel, channel) // channel: 0xc0000ae028 (*chan string)(0xc0000ae030)
   channel <- "123"                                    // Invalid operation: channel <- "123" (send to non-chan type *chan string)
}

```

结论：使用 new 函数分配内存后，数组未初始化也可以使用，而对于 slice、map、channel，即使初始化后也依然不能直接使用，其实是因为 slice、map、channel 基本数据结构是一个 struct，当使用 new 函数对其进行内存分配时，其内部的元素变量仍未进行初始化，对于这种结构，就需要用到 make 函数，make 会初始化内部结构。

### make 内置函数

```go
func make(t Type, size ...IntegerType) Type
```

- 第一个参数为类型
- 第二个参数为容器长度
- 第三个参数为 cap，可选，不传则默认等于第二个参数值

### new 和 make 区别总结

- new 函数接受一个参数类型，返回一个类型指针，函数作用是为类型分配内存空间；make 函数接收三个参数（type、size、cap），返回类型本身，函数作用是初始化类型的内存空间和结构。
- make 函数是针对`channel`、`slice`、`map`三种复合类型的，其他不可使用。
- 注意`slice`在使用 make 函数时会初始化零值
