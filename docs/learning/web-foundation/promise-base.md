# Promise 实现原理

对知乎上的图解 Promise 专栏的学习笔记。

[图解 Promise 实现原理（一）-- 基础实现](https://zhuanlan.zhihu.com/p/58428287)

主要分析文中代码。代码难点主要在 `this` 指代对象的辨析上，请先熟悉 JavaScript 的 `this`。

`Promise` 是由 JavaScript 引擎提供的接口，使用静态类型语言实现会比此文代码更易读懂，在本文代码上稍微改动既可在 ES5 及之前的版本使用 `Promise`。

## 基础版本

```jsx
//极简的实现
class Promise {
    callbacks= [];
    constructor(fn) {
        fn(this._resolve.bind(this));
    }
    then(onFulfilled) {
        this.callbacks.push(onFulfilled);
        return this;
    }
    _resolve(value) {
        setTimeout(() => {
            this.callbacks.forEach(fn => fn(value));
        });
    }
}

//Promise应用
let p=new Promise(resolve => {
    setTimeout(() => {
        console.log('done');
        resolve('5秒');
    }, 5000);
}).then((tip) => {
    console.log(tip);
})
```

暂时放弃来对 `reject` 函数的实现。

`Promise` 对象内部维护一个回调函数数组。

在实例化时，构造函数需要接受一个函数 `fn`，在 ES6 的定义中，这个函数应当接受两个函数 `resolve` 和 `reject`，但是本代码省略了 `reject` 实现，故在使用时仅有 `resolve` 作为函数参数。

`Promise` 的特点是实例化即部署，用于构造 `Promise` 的函数会在实例化成功后就运行。所以构造函数中直接调用传入的函数，而参数是 `Promise` 类中的 `_resolve` 函数。

p.s. 以 `_` 开头的变量一般被约定为私有变量，在开发过程中应避免跨类使用。`bind` 函数返回一个绑定了 `this` 的 `resolve` 函数，避免 `this` 引起的各种麻烦。

`then` 函数即把函数参数按序添加到 `Promise` 内部维护的回调函数数组中。返回 `this` 以实现链式调用。

`_resolve` 函数依次调用回调函数。`setTimeout` 避免了构造函数中无异步操作，导致 `then` 未注册便调用了回调函数。

### 状态

```jsx
class Promise {
    callbacks= [];
    state= 'pending';//增加状态
    value=null;//保存结果
    constructor(fn) {
        fn(this._resolve.bind(this));
    }
    then(onFulfilled) {
        if (this.state=== 'pending') {//在resolve之前，添加到callbacks中
            this.callbacks.push(onFulfilled);
        } else {//在resolve之后，直接执行回调，返回结果了
            onFulfilled(this.value);
        }
        return this;
    }
    _resolve(value) {
        this.state= 'fulfilled';//改变状态
        this.value= value;//保存结果
        this.callbacks.forEach(fn => fn(value));
    }
}
```

在基本的实现上添加了状态，同样忽略了 `reject`，只有 `pending` 和 `fulfilled` 状态。执行 `_resollve` 时改变状态为 `fulfilled`，记录结果（为了使 `fulfilled` 状态的 `Promise` 对 `then` 也有响应），并调用现有的回调函数。

在使用 `then` 注册回调函数时若当前 `Promise` 还未完成（`fulfilled`），则直接将回调函数加入数组。若已完成，直接调用该函数，以存储的 `value` 为参数。

---

[图解 Promise 实现原理（二）-- Promise 链式调用](https://zhuanlan.zhihu.com/p/102017798)

## 链式调用与状态/值传递

```jsx
//完整的实现
class Promise {
    callbacks= [];
    state= 'pending';//增加状态
    value=null;//保存结果
    constructor(fn) {
        fn(this._resolve.bind(this));
    }
    then(onFulfilled) {
        return new Promise(resolve => {
            this._handle({
                onFulfilled: onFulfilled||null,
                resolve: resolve
            });
        });
    }
    _handle(callback) {
        if (this.state=== 'pending') {
            this.callbacks.push(callback);
            return;
        }
        //如果then中没有传递任何东西
        if (!callback.onFulfilled) {
            callback.resolve(this.value);
            return;
        }
        var ret= callback.onFulfilled(this.value);
        callback.resolve(ret);
    }
    _resolve(value) {
        if (value && (typeof value === 'object' || typeof value === 'function'){
            var then = value.then;
            if (typeof then === 'function') {
                then.call(value, this._resolve.bind(this));
                return;
            }
        }
        this.state= 'fulfilled';//改变状态
        this.value= value;//保存结果
        this.callbacks.forEach(callback =>this._handle(callback));
    }
}
```

在一个无分枝的链式调用中，中途产生的每个 `Promise` 都最多有一个回调函数，因为每次 `then` 都会创造新的 `Promise`，之后这条链的 `then` 便于旧 `Promise` 无关了。

每次 `then` 都只用来衔接新旧 `Promise`，使用旧 `Promise` 调用 `then`，`then` 创建新 `Promise`，并将 `onFulfilled` 函数和新 `Promise` 的 `resolve` 注册到旧 `Promise` 的回调函数数组中，之后调用旧 `Promise` 的 `_handle` 函数（调用 `_handle` 函数是为了防止旧 `Promise` 已经进入 `fulfilled` 状态）。

由于 `then` 的衔接作用，`callbacks` 数组储存的就是新旧 `Promise` 链接的桥梁。通过这种存储，便能实现链式调用的分叉。

`_handle` 是用来处理新旧 `Promise` 的传递的。它有两个入口——`then` 和 `_resolve`。对于 `_resolve`，就是 `Promise` 任务完成调用 `_resolve`，随后 `_resolve` 调用 `_handle` 处理传递。对于 `then`，它调用 `_handle` 是为了避免 `Promise` 已进行了 `resolve` 而对之后挂载的 `onFulfilled` 函数无反应。因此 `_handle` 可以根据是否进行了状态传递分为两种。一种是旧 `Promise` 仍在 `pending` 状态，此时只是将 `onFulfilled` 函数挂载到 `callbacks` 上，并未进行状态传递。第二种是旧 `Promise` 已经进入 `fulfilled` 状态，则 `_handle` 会调用交给它的回调函数，并将结果交给新 `Promise` 的 `resolve`。上述代码支持无 `onFulfilled` 参数的 `then`，它会直接把结果传递下去。

在 `_resolve` 中，如果传入的为 `Promise`，则把旧 `Promise` 的 `_resolve` 挂载到这个传入的 `Promise` 上，当传入的 `Promise` 调用 `resolve` 时，则会把传入 Promise 的结果传递给新 `Promise`。

---

[图解 Promise 实现原理（三）-- Promise 原型方法实现](https://zhuanlan.zhihu.com/p/102018239)

## Promise 原型方法

### reject

对于 reject，只需在原先代码基础上照猫画虎即可，因为出现 reject 时不会接收 Promise，故只需改变状态，记录错误信息并调用 callbacks 即可。

```jsx
class Promise {
    callbacks = [];
    state = 'pending';//增加状态
    value = null;//保存结果
    constructor(fn) {
        fn(this._resolve.bind(this), this._reject.bind(this));
    }
    then(onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
            this._handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            });
        });
    }
    _handle(callback) {
        if (this.state === 'pending') {
            this.callbacks.push(callback);
            return;
        }

        let cb = this.state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;

        if (!cb) {//如果then中没有传递任何东西
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
            cb(this.value);
            return;
        }

        let ret = cb(this.value);
        cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
        cb(ret);
    }
    _resolve(value) {

        if (value && (typeof value === 'object' || typeof value === 'function')) {
            var then = value.then;
            if (typeof then === 'function') {
                then.call(value, this._resolve.bind(this), this._reject.bind(this));
                return;
            }
        }

        this.state = 'fulfilled';//改变状态
        this.value = value;//保存结果
        this.callbacks.forEach(callback => this._handle(callback));
    }
    _reject(error) {
        this.state = 'rejected';
        this.value = error;
        this.callbacks.forEach(callback => this._handle(callback));
    }
}
```

### 异常处理

#### 处理 `then` 中错误

基本思路是在调用 `onFulfilled` 和 `onRejected` 时使用 `try ... catch` 语句，并将 `Promise`（指上述文章中提到的新 `Promise`，因为 `onFulfilled` 是新 `Promise` 通过旧 `Promise` 的 `then` 挂载的）设置为 `rejected` 状态。（在 `Promise` 构造函数中的 `error` 由使用 `Promise` 的人处理，思路应当是一样的）

改变 `_handle` 方法。下面操作中第一次调用 `cb` 是部署 `then` 产生的新 `Promise` ，第二次是新 `Promise` 得到结果后使用 `resolve/reject`。虽然用了同一个名字，但实际上不是一回事。

```jsx
_handle(callback) {
    if (this.state === 'pending') {
        this.callbacks.push(callback);
        return;
    }

    let cb = this.state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;

    if (!cb) {//如果then中没有传递任何东西
        cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
        cb(this.value);
        return;
    }

    let ret;

    try {
        ret = cb(this.value);
        cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
    } catch (error) {
        ret = error;
        cb = callback.reject
    } finally {
        cb(ret);
    }

}
```

#### catch

`catch` 方法是 `then(null,onRejected)` 的别名，根据上述代码，它在 `fulfilled` 状态仅仅将值传递下去，而出现错误时能对其进行处理，声明了 `catch` 方法后，就可以在 `then` 中只设置 `onfulfilled` 函数，使用 `catch` 对链式调用中的错误进行兜底。

```jsx
catch(onError){
    return this.then(null, onError);
}
```

### finally

不使用 `then(onDone,onDone)`，因为 `finally` 内的函数是无参数的，并且要求能够保持 `finally` 之前的状态和结果。

```jsx
finally(onDone) {
    if (typeof onDone !== 'function') return this.then();
    let Promise = this.constructor;
    return this.then(
        value => Promise.resolve(onDone()).then(() => value),
        reason => Promise.resolve(onDone()).then(() => { throw reason })
    );
}
static resolve() {...}
```

关于 `Promise.resolve` 的问题在下节叙述，在黑盒子外可以认为：

```jsx
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

`finally` 的逻辑就是构造直接进行 `resolve` 的 `Promise`。在 `resolve` 时，它接收的是 `onDone()` 而不是 `onDone`，`onDone` 被执行了。随后使用 `then` 丢弃 `resolve` 结果，返回 `finally` 之前的状态。

---

[图解 Promise 实现原理（四）-- Promise 静态方法实现](https://zhuanlan.zhihu.com/p/102018323)

## 静态方法

### resolve

```jsx
static resolve(value) {
    if (value && value instanceof Promise) {
        return value;
    } else if (value && typeof value === 'object' && typeof value.then === 'function') {
        let then = value.then;
        return new Promise(resolve => {
            then(resolve);
        });

    } else if (value) {
        return new Promise(resolve => resolve(value));
    } else {
        return new Promise(resolve => resolve());
    }
}
```

对于 Promise，实现了 then 的对象，其他值，无参数，该静态方法有不同的处理逻辑。

### reject

```jsx
static reject(value) {
    if (value && typeof value === 'object' && typeof value.then === 'function') {
        let then = value.then;
        return new Promise((resolve, reject) => {
            then(reject);
        });
    } else {
        return new Promise((resolve, reject) => reject(value));
    }
}
```

Promise.reject 会始终返回一个状态为 rejected 的 Promise 实例。

### all

```jsx
static all(promises) {
    return new Promise((resolve, reject) => {
        let fulfilledCount = 0
        const itemNum = promises.length
        const rets = Array.from({ length: itemNum })
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(result => {
                fulfilledCount++;
                rets[index] = result;
                if (fulfilledCount === itemNum) {
                    resolve(rets);
                }
            }, reason => reject(reason));
        })

    })
}
```

### race

```jsx
static race(promises) {
    return new Promise(function (resolve, reject) {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(function (value) {
                return resolve(value)
            }, function (reason) {
                return reject(reason)
            })
        }
    })
}
```

使上述代码正常工作，需要在 resolve 和 reject 中加入避免 Promise 状态改变的代码。如下。

```jsx
_resolve(value) {
    if(this.state!='pending')return;
    ...
}
```
