# RxJS 基础概念理解

前置知识 [Promise 原理](../web-foundation/promise-base.md)

因为在最开始学 RxJS 的时候既不知道 RxJS 要解决什么，又不理解它奇怪的起名，导致官方文档看不下去，又因为需要马上做一个 Request 管理模块出来，所以就跟着 [Learn RxJS](learnrxjs.io) 上的带示例文档先勉强把工具写出来了。之后跟着知乎上 [图解 Promise](https://zhuanlan.zhihu.com/p/58428287) 系列好好地看了看Promise 是怎么实现的。后来又想看看 RxJS，发现两者十分相像。于是简单辨析一下 RxJS 官方文档中 Introduction 介绍的各种概念。

下文概念将使用英文原名以避免翻译导致的混淆。

如果能够理解 Promise 的使用方法，不需要纠结于什么是 Pull 和 Push，还有观察者模式。关注逻辑本身。

## Observable

是数据的发生器，每次数据发生都只交给一个 Observer（也称单播）。

它的创建（仅介绍最基本的 `.create()`）接收一个函数，这个函数应当具有以下形态

```js
function (observer){
  // deal with data
  // observer.next(data);
  // observer.error(error);
  // observer.complete();
}
```

这个函数将配合后来挂载到 Observable 上的 Observer，将数据传递给 Observable 对应的函数。

看起来很像 Promise 的部署（或者称初始化过程），但区别是 Observable 是被动的（或称「懒」），它并不会立刻执行，而是被触发时才会执行。

当 Observable 被触发时（触发有多种方式，Introduction 中最先出现的是使用 `subscribe()` 方法，该方法将 Observer 挂载到 Observable 上，立即触发实例化 Observable 时使用的函数，并返回一个 Subscription），它会调用创建时的函数，通过接口（指 `next()`, `error()`, `complete()`）将数据传输给 Observer 的处理函数。

## Observer

是一个简单的对象，它是 Observable 输出结果的处理函数的集合。

它必须包含 `next` 属性，可包含 `error` 和 `complete` 属性，此三属性需为函数。

上文提到的 `subscribe()` 方法可直接接受三个函数参数来替代 Observer 参数。

## Subscription

通常 Subscription 是通过 Observable 的触发得到的。一个 Subscription 代表有一个 Observable-Observer 已经被触发了。Subscription 通常用来取消 Observable 的执行（使用 `unsubscribe()` 方法）。

## Subject

Subject 是 Observable 和 Observer 的链接器，它拥有 `next()`, `error()`, `complete()`, `subscribe()` 方法。它能在链接多个 Observer 后，链接一个 Observable，链接 Observable 时会触发 Observable，Observable 产生的数据会传递给 Subject 链接的所有 Observer（实现多播）。

使用 `multicast()` 操作符可以控制触发 Observable 的时机（原来触发是在挂载时立即发生的，现在需要调用 `connect()`）。

使用 `refCount()` 操作符可以将 `connect()` 和`unsubscribe()` 的调用自动化，在出现第一个 Observer 的链接时调用 `connect()` ，在所有 Subscription 取消后，取消 `Observable` 的执行。

Subject 有多种变体，不再叙述。