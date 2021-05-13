# Rollup

## 为什么学 Rollup？

Vite 现在默认使用 Rollup 进行打包。而许多 npm 包使用 CommonJS 语法，甚至会在运行时调用 process 变量。

Rollup 提供了将 CommonJS 语法打包为 ES6 语法的途径，来让前端开发更方便。

## 什么是打包？

在 ES6 发布前，JavaScript 不支持模块化（存在社区标准 CommonJS，但是 CommonJS 是因服务端开发需求而诞生的）。为了在开发过程中实现模块化，出现了 Webpack、Rollup 等打包工具，将开发过程中众多互相依赖的源码文件（不仅是 JavaScript，还有 HTML 和 CSS）全部塞进几个文件中（也是因此输出文件常被叫做 bundle），来实现在浏览器上的部署。

现代前端开发中脚手架（快速生成某种基本结构的命令或程序）似乎过于方便，以至于打包的原因被忽略了。

有兴趣可以看看 d3.js 在 github 上的代码。[d3/d3](https://github.com/d3/d3) 本身只是一个打包器，功能代码存放在 [d3](https://github.com/d3) 的其他项目中。

## Rollup

Rollup 的出现离不开 ES6 模块标准的推出。Rollup 最终的编译结果是 ES6 标准的模块，也是因此它只能在支持 ES6 模块标准的浏览器上使用。

