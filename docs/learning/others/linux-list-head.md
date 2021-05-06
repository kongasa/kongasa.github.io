# Linux list_head

参考：

[Linux 内核list_head 学习（一）](https://www.cnblogs.com/zhuyp1015/archive/2012/06/02/2532240.html)

[C 语言中，「.」与「->」有什么区别？](https://www.zhihu.com/question/49164544/answer/301969545)

Linux 的链表很有意思。

linux 的链表只包含两个指针，是一个双向循环有头节点的链表结构。它不包含其他数据结构，其他数据结构包含它，头节点不被包含。

给出链表节点地址，节点数据类型，链表数据类型（对于链表永远是 `list_head`，但是这个宏是通用的），就可以得到包含列表的节点的地址。

```c
#define offsetof(TYPE,MEMBER) ((size_t)&((TYPE *)0)->MEMBER)

#define container_of(ptr,type,member) ((type*)((char*)ptr-offsetof(type,member)))
```

`offsetof` 的设计非常精妙。它相当于是程序员向编译器发问，「假如， MEMBER 所属的对象地址在 0，那你应该能帮我拿到 MEMBER 吧？我知道你不会真的去访问内存，引起中断，导致崩溃。把它的地址给我就行。」

因为对象从 0 地址开始，offsetof 返回的值就是 MEMBER 的偏移量。

`container_of` 故技重施，是 `offsetof` 的反向操作。

关于为什么 `((TYPE*) 0)->MEMBER` 不会发生内存访问。请看

[C 语言中，「.」与「->」有什么区别？](https://www.zhihu.com/question/49164544/answer/301969545)

使用 `.` 的表达式（一个变量也是表达式，而且 `a.b` 不是变量，因为 `.` 是个操作符 ）是左值还是右值取决于 `.` 的左操作数，而使用 `->` 的表达式将永远是个左值。访问地址是运行时发生的，但是因为这个宏并没有用到地址上的数据，编译后的机器码并不会发生内存访问，也就不会发生中断。改一改编译器的话，这个宏就可能出问题。