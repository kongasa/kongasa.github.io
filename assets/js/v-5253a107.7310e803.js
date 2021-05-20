(self.webpackChunkkongasa_blog=self.webpackChunkkongasa_blog||[]).push([[421],{4351:(s,n,a)=>{"use strict";a.r(n),a.d(n,{data:()=>p});const p={key:"v-5253a107",path:"/learning/visualization/d3.html",title:"d3/d3 2021.05.19 master",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[],filePathRelative:"learning/visualization/d3.md",git:{updatedTime:1621489592e3}}},5709:(s,n,a)=>{"use strict";a.r(n),a.d(n,{default:()=>o});const p=(0,a(6252).uE)('<h1 id="d3-d3-2021-05-19-master"><a class="header-anchor" href="#d3-d3-2021-05-19-master">#</a> d3/d3 2021.05.19 master</h1><p>Bring data to life with SVG, Canvas and HTML.</p><p>是d3的汇总项目，关键文件为根目录下的 index.js</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token punctuation">{</span>version<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./dist/package.js&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-array&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-axis&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-brush&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-chord&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-color&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-contour&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-delaunay&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-dispatch&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-drag&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-dsv&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-ease&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-fetch&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-force&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-format&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-geo&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-hierarchy&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-interpolate&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-path&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-polygon&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-quadtree&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-random&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-scale&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-scale-chromatic&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-selection&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-shape&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-time&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-time-format&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-timer&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-transition&quot;</span><span class="token punctuation">;</span>\n<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&quot;d3-zoom&quot;</span><span class="token punctuation">;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br></div></div><p>package.json 文件定义了以上各个功能包，index.js 功能是将各个功能包合并使用 Rollup 打包。打包出来的文件可读性高，假若不怕文件过长，同组函数分散，可以直接阅读打包出来的代码。</p>',5),o={render:function(s,n){return p}}}}]);