(self.webpackChunkkongasa_blog=self.webpackChunkkongasa_blog||[]).push([[556],{1012:(e,a,r)=>{"use strict";r.r(a),r.d(a,{data:()=>l});const l={key:"v-dcee063e",path:"/learning/vue/vue-analysis/ready.html",title:"基础准备",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"Flow",slug:"flow",children:[]},{level:2,title:"源码目录",slug:"源码目录",children:[{level:3,title:"compiler",slug:"compiler",children:[]},{level:3,title:"core",slug:"core",children:[]},{level:3,title:"platform",slug:"platform",children:[]},{level:3,title:"server",slug:"server",children:[]},{level:3,title:"sfc",slug:"sfc",children:[]},{level:3,title:"shared",slug:"shared",children:[]}]},{level:2,title:"源码构建",slug:"源码构建",children:[]}],filePathRelative:"learning/vue/vue-analysis/ready.md",git:{updatedTime:1621177754e3}}},7125:(e,a,r)=>{"use strict";r.r(a),r.d(a,{default:()=>s});const l=(0,r(6252).uE)('<h1 id="基础准备"><a class="header-anchor" href="#基础准备">#</a> 基础准备</h1><h2 id="flow"><a class="header-anchor" href="#flow">#</a> Flow</h2><p>JavaScript 的静态分析工具，在未运行时检查出代码缺陷</p><p>Flow 的工作方式主要有两种。类型推断和类型注释。类型注释需要在写代码时进行一些类似 TypeScript 中的类型声明。</p><p>Flow 是 Vue v2.x 采用的静态分析工具。在 Vue v3.x 中使用的是 TypeScript。</p><h2 id="源码目录"><a class="header-anchor" href="#源码目录">#</a> 源码目录</h2><div class="language-text ext-text line-numbers-mode"><pre class="language-text"><code>src\n├── compiler        # 编译相关 \n├── core            # 核心代码 \n├── platforms       # 不同平台的支持\n├── server          # 服务端渲染\n├── sfc             # .vue 文件解析\n├── shared          # 共享代码\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="compiler"><a class="header-anchor" href="#compiler">#</a> compiler</h3><p>浏览器并不会花时间去支持一个没有标准的东西。Vue 最终需要变成原生的三大件。AST 的解析和生成都在此模块中。</p><h3 id="core"><a class="header-anchor" href="#core">#</a> core</h3><p>核心代码</p><h3 id="platform"><a class="header-anchor" href="#platform">#</a> platform</h3><p>用来支持跨平台部署。</p><h3 id="server"><a class="header-anchor" href="#server">#</a> server</h3><p>服务端渲染相关代码。</p><h3 id="sfc"><a class="header-anchor" href="#sfc">#</a> sfc</h3><p>用于将 .vue 文件解析成 JavaScript 对象。</p><h3 id="shared"><a class="header-anchor" href="#shared">#</a> shared</h3><p>定义工具方法。</p><h2 id="源码构建"><a class="header-anchor" href="#源码构建">#</a> 源码构建</h2><p>//TODO</p>',21),s={render:function(e,a){return l}}}}]);