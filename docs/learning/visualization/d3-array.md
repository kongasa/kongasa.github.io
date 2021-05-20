# d3/d3-array 2021.5.19 master

依赖于 internmap 包。

## array.js

```js
var array = Array.prototype;

export var slice = array.slice;
export var map = array.map;
```

对 Array 类的原型进行拆包，直接将 slice 和 map 方法输出。

## ascending.js

```js
export default function(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}
```

当 `a < b` 时，返回 `-1`，`a > b` 时，返回 `1`，`a == b` 时，返回 `0`，出现其他情况则返回 `NaN`。

## descending.js

```js
export default function(a, b) {
  return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
}
```

道理同上。

## bisector.js

```js
import ascending from "./ascending.js";

// 工具方法，根据输入函数，输出三种二分查找函数
// 传入一个函数（或某个拥有length属性的对象？），返回二分选择器，
// 拥有 left，center，right 三个方法。
export default function(f) {
  let delta = f;
  let compare = f;

  // 一个函数的 length 是它接受参数的个数，
  // 以下语句使得f 可接受两参数函数也可接受单参数函数
  if (f.length === 1) {
    delta = (d, x) => f(d) - x;
    compare = ascendingComparator(f);
  }

  function left(a, x, lo, hi) {
    // a：有序，拥有 length 属性，且可通过 index 进行索引的属性。
    // x：查找的值
    // lo：低索引
    // hi：高索引
    
    // 若未设置 lo hi，则自动将范围设为整个 a
    if (lo == null) lo = 0;
    if (hi == null) hi = a.length;
    // 二分法操作，与 right() 的差别是，查找到 x 元素时，如何操作
    // 在 left 中会将 hi 设为 mid
    // 如此导致的结果是，若 a 中有若干相同的 x 元素，则返回最左侧的 x 位置
    while (lo < hi) {
      // JS 中只有 number 类型，采用右移方法实现除二并向下取整
      const mid = (lo + hi) >>> 1;
      if (compare(a[mid], x) < 0) lo = mid + 1;
      else hi = mid;
    }
    // 若 x 出现在 a 的范围中，但并不是 a 的某个元素（如 a = [1,3], x = 2）。
    // 则最终返回的位置将为最接近 x 的右侧一个位置，上行例子将返回 1
    // 若 x = 0，则返回 0，
    // 若 x = 4，则返回 2（也就是 length）
    return lo;
  }
  // 逻辑参见 left()
  function right(a, x, lo, hi) {
    if (lo == null) lo = 0;
    if (hi == null) hi = a.length;
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (compare(a[mid], x) > 0) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }

  // 返回距离 x 最近的位置
  function center(a, x, lo, hi) {
    if (lo == null) lo = 0;
    if (hi == null) hi = a.length;
    const i = left(a, x, lo, hi - 1);
    // 距离的判断是线性的，根据 x 两边值的平均值进行判定
    return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
  }

  return {left, center, right};
}

// 工具函数，不对外输出，对 ascending() 函数
// 的第一个参数执行 f()，再执行ascending()
function ascendingComparator(f) {
  return (d, x) => ascending(f(d), x);
}
```

## number.js

```js
// 类型转换
export default function(x) {
  return x === null ? NaN : +x;
}

export function* numbers(values, valueof) {
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        yield value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
        yield value;
      }
    }
  }
}
```

## bisect.js

前置需要 ascending.js, bisector.js, number.js。

是 bisector 的包裹函数。

```js
import ascending from "./ascending.js";
import bisector from "./bisector.js";
import number from "./number.js";

// 创建升序二分选择器
const ascendingBisect = bisector(ascending);
export const bisectRight = ascendingBisect.right;
export const bisectLeft = ascendingBisect.left;
export const bisectCenter = bisector(number).center;
export default bisectRight;
```

## constant.js

```js
// 使用闭包的常量创造函数
export default function(x) {
  return function() {
    return x;
  };
}
```

## extent.js

```js
// 获得一组值的最小值和最大值
// 可以使用 valueof 函数对原值进行变换，最多可向 valueof 提供三个参数
export default function(values, valueof) {
  let min;
  let max;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null) {
        if (min === undefined) {
          if (value >= value) min = max = value;
        } else {
          if (min > value) min = value;
          if (max < value) max = value;
        }
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null) {
        if (min === undefined) {
          if (value >= value) min = max = value;
        } else {
          if (min > value) min = value;
          if (max < value) max = value;
        }
      }
    }
  }
  return [min, max];
}
```

## identity.js

不是很理解意义何在。

```js
export default function(x) {
  return x;
}
```

## ticks.js

是用于生成刻度的数学包，刻度密度与 `count` 参数有关，但是每个单位之间的刻度数还会是 1、2、5 的倍数，或每个刻度之间的单位数为1、2、5的倍数。之后再看。

```js
var e10 = Math.sqrt(50),
    e5 = Math.sqrt(10),
    e2 = Math.sqrt(2);

export default function(start, stop, count) {
  var reverse,
      i = -1,
      n,
      ticks,
      step;

  stop = +stop, start = +start, count = +count;
  if (start === stop && count > 0) return [start];
  if (reverse = stop < start) n = start, start = stop, stop = n;
  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

  if (step > 0) {
    let r0 = Math.round(start / step), r1 = Math.round(stop / step);
    if (r0 * step < start) ++r0;
    if (r1 * step > stop) --r1;
    ticks = new Array(n = r1 - r0 + 1);
    while (++i < n) ticks[i] = (r0 + i) * step;
  } else {
    step = -step;
    let r0 = Math.round(start * step), r1 = Math.round(stop * step);
    if (r0 / step < start) ++r0;
    if (r1 / step > stop) --r1;
    ticks = new Array(n = r1 - r0 + 1);
    while (++i < n) ticks[i] = (r0 + i) / step;
  }

  if (reverse) ticks.reverse();

  return ticks;
}

export function tickIncrement(start, stop, count) {
  var step = (stop - start) / Math.max(0, count),
      power = Math.floor(Math.log(step) / Math.LN10),
      error = step / Math.pow(10, power);
  return power >= 0
      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
}

export function tickStep(start, stop, count) {
  var step0 = Math.abs(stop - start) / Math.max(0, count),
      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
      error = step0 / step1;
  if (error >= e10) step1 *= 10;
  else if (error >= e5) step1 *= 5;
  else if (error >= e2) step1 *= 2;
  return stop < start ? -step1 : step1;
}
```

## nice.js

根据给定的 start 和 stop，根据 tickIncrement 找一个合适的新 start 和stop。

```js
import {tickIncrement} from "./ticks.js";

export default function nice(start, stop, count) {
  let prestep;
  while (true) {
    const step = tickIncrement(start, stop, count);
    if (step === prestep || step === 0 || !isFinite(step)) {
      return [start, stop];
    } else if (step > 0) {
      start = Math.floor(start / step) * step;
      stop = Math.ceil(stop / step) * step;
    } else if (step < 0) {
      start = Math.ceil(start * step) / step;
      stop = Math.floor(stop * step) / step;
    }
    prestep = step;
  }
}
```

## count.js

```js
// 计算 values 数组中有效元素的个数，可使用 valueof 函数进行转换
export default function count(values, valueof) {
  let count = 0;
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        ++count;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
        ++count;
      }
    }
  }
  return count;
}
```



## threshold

### freemanDiaconis.js

### Scott.js

### Sturges.js

```js
import count from "../count.js";
// 看起来是在求对于一个给定的数组，能够对它所有位置进行索引所需的二进制位数
export default function(values) {
  return Math.ceil(Math.log(count(values)) / Math.LN2) + 1;
}
```

## bin.js

前置需要 slice (from array.js), bisect.js, constant.js, extent.js, identity.js, nice.js, ticks.js, sturges.js。

```js
import {slice} from "./array.js";
import bisect from "./bisect.js";
import constant from "./constant.js";
import extent from "./extent.js";
import identity from "./identity.js";
import nice from "./nice.js";
import ticks, {tickIncrement} from "./ticks.js";
import sturges from "./threshold/sturges.js";

export default function() {
  var value = identity,
      domain = extent,
      threshold = sturges;

  function histogram(data) {
    if (!Array.isArray(data)) data = Array.from(data);

    var i,
        n = data.length,
        x,
        values = new Array(n);

    for (i = 0; i < n; ++i) {
      values[i] = value(data[i], i, data);
    }

    var xz = domain(values),
        x0 = xz[0],
        x1 = xz[1],
        tz = threshold(values, x0, x1);

    // Convert number of thresholds into uniform thresholds,
    // and nice the default domain accordingly.
    if (!Array.isArray(tz)) {
      const max = x1, tn = +tz;
      if (domain === extent) [x0, x1] = nice(x0, x1, tn);
      tz = ticks(x0, x1, tn);

      // If the last threshold is coincident with 
      // the domain’s upper bound, the last bin will be
      // zero-width. If the default domain is used, and this
      // last threshold is coincident with the maximum
      // input value, we can extend the niced upper bound
      // by one tick to ensure uniform bin widths;otherwise,
      // we simply remove the last threshold. Note that we don’t
      // coerce values or the domain to numbers,
      // and thus must be careful to compare order (>=)
      // rather than strict equality (===)!
      if (tz[tz.length - 1] >= x1) {
        if (max >= x1 && domain === extent) {
          const step = tickIncrement(x0, x1, tn);
          if (isFinite(step)) {
            if (step > 0) {
              x1 = (Math.floor(x1 / step) + 1) * step;
            } else if (step < 0) {
              x1 = (Math.ceil(x1 * -step) + 1) / -step;
            }
          }
        } else {
          tz.pop();
        }
      }
    }

    // Remove any thresholds outside the domain.
    var m = tz.length;
    while (tz[0] <= x0) tz.shift(), --m;
    while (tz[m - 1] > x1) tz.pop(), --m;

    var bins = new Array(m + 1),
        bin;

    // Initialize bins.
    for (i = 0; i <= m; ++i) {
      bin = bins[i] = [];
      bin.x0 = i > 0 ? tz[i - 1] : x0;
      bin.x1 = i < m ? tz[i] : x1;
    }

    // Assign data to bins by value, ignoring any outside the domain.
    for (i = 0; i < n; ++i) {
      x = values[i];
      if (x0 <= x && x <= x1) {
        bins[bisect(tz, x, 0, m)].push(data[i]);
      }
    }

    return bins;
  }

  histogram.value = function(_) {
    return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
  };

  histogram.domain = function(_) {
    return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
  };

  histogram.thresholds = function(_) {
    return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
  };

  return histogram;
}
```

## cross.js

此处有一个知识，`...` 出现在函数定义的参数位置时，表示剩余参数语法。出现在函数调用或者字面量构造时，表示展开语法。

奇技淫巧的痕迹很重，不要把 i 和 j 当成 for 遍历中的 i 和 j。

```js
// 返回数组长度，没有 length 属性则返回 0
function length(array) {
  return array.length | 0;
}

// 可以理解为若为 0，返回 true
function empty(length) {
  return !(length > 0);
}

// 数组化
function arrayify(values) {
  return typeof values !== "object" || "length" in values ? values : Array.from(values);
}
// 实际上只是加一层函数包裹，然后自动展开输入参数
function reducer(reduce) {
  return values => reduce(...values);
}

// 返回若干向量型数组的全搭配向量型数组
// 称之为「向量型」是因为这个函数和向量计算有很大关系
export default function cross(...values) {
  // 如果最后一个参数是函数的话
  // 则 reduce = reducer(values.pop());
  // 这句话删除了 values 的最后一个位置上的函数
  // 并且使用 reducer 包装最后这个函数
  const reduce = typeof values[values.length - 1] === "function" && reducer(values.pop());
  // 将 values 的每个元素数组化
  values = values.map(arrayify);
  const lengths = values.map(length);
  const j = values.length - 1;
  // 创建等长数组，并将所有元素初始化为 0
  const index = new Array(j + 1).fill(0);
  const product = [];
  // 若 values 为空，或者 values 的元素为空，返回空数组
  if (j < 0 || lengths.some(empty)) return product;
  while (true) {
    // 放置一个搭配
    product.push(index.map((j, i) => values[i][j]));
    let i = j;
    // 判断是否终止，以及更新 index 数组
    // 注意 j 是永远不变的，它始终代表原始向量型数组的个数
    // 让最后一个索引的值自增 1
    // 判断这个索引是否到达了边界
    // 如果到达了边界
    // 判断是否是第一个向量型数组到达了边界
    // 若第一个向量型数组都到达了边界
    // 那么遍历完毕，返回结果
    // 如果非第一个向量型数组到达了边界
    // 将其索引归为 0，且不跳出 while 循环
    // 下一次将继续使前一个向量型数组的索引自增 1，并继续判断
    while (++index[i] === lengths[i]) {
      if (i === 0) return reduce ? product.map(reduce) : product;
      index[i--] = 0;
    }
  }
}
```

## cumsum.js

```js
// 返回前缀和数组
export default function cumsum(values, valueof) {
  var sum = 0, index = 0;
  return Float64Array.from(values, valueof === undefined
    ? v => (sum += +v || 0)
    : v => (sum += +valueof(v, index++, values) || 0));
}
```

## variance.js

```js
// 使用 Welford online algorithm 计算方差
export default function variance(values, valueof) {
  let count = 0;
  let delta;
  let mean = 0;
  let sum = 0;
  if (valueof === undefined) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        delta = value - mean;
        mean += delta / ++count;
        sum += delta * (value - mean);
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
        delta = value - mean;
        mean += delta / ++count;
        sum += delta * (value - mean);
      }
    }
  }
  if (count > 1) return sum / (count - 1);
}
```

## deviation.js

```js
import variance from "./variance.js";
// 计算标准差
export default function deviation(values, valueof) {
  const v = variance(values, valueof);
  return v ? Math.sqrt(v) : v;
}
```

## difference.js

```js
// 集合的差操作
export default function difference(values, ...others) {
  values = new Set(values);
  for (const other of others) {
    for (const value of other) {
      values.delete(value);
    }
  }
  return values;
}
```

## disjoint.js

验证两个集合是否为互斥集，两个参数都应实现迭代器协议。

```js
export default function disjoint(values, other) {
  // 本质是利用 Set 判断互斥
  const iterator = other[Symbol.iterator](), set = new Set();
  for (const v of values) {
    if (set.has(v)) return false;
    let value, done;
    // 这个 while 循环只会在第一个 for 循环中运行，
    // 之后将永远在第一次 break 处跳出
    while (({value, done} = iterator.next())) {
      if (done) break;
      if (Object.is(v, value)) return false;
      set.add(value);
    }
  }
  return true;
}
```

## every.js

```js
// 对于 values 中的每一个元素，test 都返回 true，则 every 才返回 true。
export default function every(values, test) {
  if (typeof test !== "function") throw new TypeError("test is not a function");
  let index = -1;
  for (const value of values) {
    if (!test(value, ++index, values)) {
      return false;
    }
  }
  return true;
}
```

## some.js

```js
// 与 every 类似
export default function some(values, test) {
  if (typeof test !== "function") throw new TypeError("test is not a function");
  let index = -1;
  for (const value of values) {
    if (test(value, ++index, values)) {
      return true;
    }
  }
  return false;
}
```

## filter.js

```js
// 功能同 Array.prototype.filter
export default function filter(values, test) {
  if (typeof test !== "function") throw new TypeError("test is not a function");
  const array = [];
  let index = -1;
  for (const value of values) {
    if (test(value, ++index, values)) {
      array.push(value);
    }
  }
  return array;
}
```

## fsum.js

```js
// 高精度的 sum 和 cumsum，再见 JS 精度
export class Adder {
  constructor() {
    // 初始化，精度为 32 个 64 位浮点数
    this._partials = new Float64Array(32);
    this._n = 0;
  }
  // 在 add 中，影响最终效果的只有 i 和 x 两个变量
  // 每次 add 都会扫面一遍，并从新建立 p
  // 因为代码始终在同一个数组上操作，可能有点迷惑
  // 把已有的 p 和更新后的 p 当作两个数组会更好理解
  add(x) {
    const p = this._partials;
    let i = 0;
    // 循环中没有跳出语句，说明每次都会对 p 进行扫描
    // 某一位只要被扫描过了，那它就成为了无用位
    // 某一位是否有用应该看它与 i 的关系
    for (let j = 0; j < this._n && j < 32; j++) {
      const y = p[j],
        hi = x + y,
        lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
      // 当精度没出问题的时候，下行语句不会执行
      // 即不会扩展有效最高位
      // 有效最高位就是发生了近似后的值
      // 其他低位都是修正值
      // 精度出了问题，把修正用值更新到新的 p 中
      if (lo) p[i++] = lo;
      // 当精度没出问题的时候，x 就是加的结果
      // 精度出问题，则 x 需要新 p 的修正才能表示正确值
      x = hi;
    }
    // 此时 i 代表的是这个数组的有效最高位
    // 假如一直没发生精度问题，则有效最高位永远是0
    p[i] = x;
    // n 代表有效位的数量，高于有效位的位置将被忽略
    this._n = i + 1;
    return this;
  }
  // 转换为 number 时使用的函数。
  valueOf() {
    const p = this._partials;
    let n = this._n, x, y, lo, hi = 0;
    // n == 0 说明未调用 add，返回 0
    // n == 1 说明未发生精度问题，p 只保存了一个有效的 number
    // 直接返回此 number
    if (n > 0) {
      hi = p[--n];
      while (n > 0) {
        x = hi;
        y = p[--n];
        hi = x + y;
        lo = y - (hi - x);
        // 当修正值发生精度问题后，停止修正
        if (lo) break;
      }
      if (n > 0 && ((lo < 0 && p[n - 1] < 0) || (lo > 0 && p[n - 1] > 0))) {
        y = lo * 2;
        x = hi + y;
        if (y == x - hi) hi = x;
      }
    }
    return hi;
  }
}

export function fsum(values, valueof) {
  const adder = new Adder();
  if (valueof === undefined) {
    for (let value of values) {
      if (value = +value) {
        adder.add(value);
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if (value = +valueof(value, ++index, values)) {
        adder.add(value);
      }
    }
  }
  // 将 adder 转化为 number
  return +adder;
}

export function fcumsum(values, valueof) {
  const adder = new Adder();
  let index = -1;
  return Float64Array.from(values, valueof === undefined
      ? v => adder.add(+v || 0)
      : v => adder.add(+valueof(v, ++index, values) || 0)
  );
}
```

## greatest.js

```js
import ascending from "./ascending.js";
// 寻找最大值，允许自定义比较函数/求值函数
export default function greatest(values, compare = ascending) {
  let max;
  let defined = false;
  if (compare.length === 1) {
    let maxValue;
    for (const element of values) {
      const value = compare(element);
      if (defined
          ? ascending(value, maxValue) > 0
          : ascending(value, value) === 0) {
        max = element;
        maxValue = value;
        defined = true;
      }
    }
  } else {
    for (const value of values) {
      if (defined
          ? compare(value, max) > 0
          : compare(value, value) === 0) {
        max = value;
        defined = true;
      }
    }
  }
  return max;
}
```

