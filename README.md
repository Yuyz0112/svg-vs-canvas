# svg-vs-canvas

通过 d3.js 绘制 area chart 以及对应坐标轴。
其中 `renderSvg` 为通过 svg 绘图，`renderCanvas` 为通过 canvas 绘图。

两个 render 方法中都通过 `performance.mark` 进行标记，再通过 `performance.measure` 对各部分耗时进行统计。
在 chrome 开发者工具中，选择 Performance 标签，在 user timing 中可以看到对应 render 方法的耗时火焰图。

**为了保证结果准确，请勿同时执行 `renderCanvas` 和 `renderSvg` 方法并统计，因为 JS 引擎的缓存功能可能会导致后执行的方法被加速。**
