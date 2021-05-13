# Vuex

Vuex 是使用在 Vue 中的 state management（状态控制器，但是由于 state 在响应式前端中是一个专有名词，而状态太过笼统，故不做翻译）。

Vuex v4.x 针对 Vue3 开发，是本文研究对象。

## 核心概念

### State

Vuex 在设计上被设计成单一状态树结构，整个应用使用一个对象进行存取。

Vuex 中存储的数据要求和 Vue 的 data 一样，需要是纯粹的（通常是由写代码的人创建的变量，一般具有懒惰性质，假如程序员没有对其进行直接改变，它就不会改变，像 window，document 等由浏览器提供的变量就是不纯粹的）。

Vuex 将状态树从 Vue 的根组件注入，所有后代组件都可以通过 this.$store 进行访问。 

### Getter

由于会对储存的 state 进行一些通用的操作，为减少冗余，可以在 store 中定义 getter，通过属性或方法方式进行访问。

### Mutation

更改 Vuex 的 state 的唯一方式是提交 mutation。

在 store 中声明（`mutationName(state, ...args){}`）后，可以使用 `store.commit(‘mutationName’, ...args)` 方法进行调用。

mutation 必须是同步函数。或者说不能把异步功能放到 mutation 中。

### Action

action 提交 mutation，但不直接改变状态。action 可以包含异步操作。

```vue
actions: {
  increment (context) {
    context.commit('increment')
  }
}
```

其中的 context 对象拥有和 store 相同的方法和属性。

使用 `store.dispatch(‘actionName’, ...args)` 进行触发。

action 是可以返回 Promise 的，因此可以使用 then 进行异步调用。

### Module

防止 store 变得过大，Vuex 允许将 store 分割为几个模块。

在模块中 mutation 和 getter 接受的是模块的状态对象。

根节点在 action 中通过 context.rootState 暴露，在 getter 中通过第三个参数暴露

## 组合式 API

调用 useStore 函数可以在 setup 中访问 store，这和 this.$store 是一致的。

访问 state 和 getter 需要创建 computed 来保留响应性。

调用 mutation 和 action 可以直接通过 useStore 提供的 store。