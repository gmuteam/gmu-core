GMU 3.0 Core
============

## 关于 GMU 3.0
GMU 3.0 是新组件时代的移动端 Web 开发框架。

在技术层面，它基于 [Web Components](www.w3.org/TR/components-intro/#introduction) 标准以及 [Polymer-Project](http://www.polymer-project.org/) 。

在组件层面则基于 [X-SPEC](http://fex.baidu.com/xspec/index.html) 规范来实现。

## 关于 GMU 3.0 Core

GMU 3.0 Core 实际上是 X-SPEC 规范通用部分的实现，它既是 GMU 3.0 的底层，同时任何第三方开发者也可以以此为基础开发兼容 X-SPEC 的组件库。

## 与 Polymer-Project 的关系

GMU 3.0 Core 目前基于 Polymer-Project，在其基础上扩展了部分标签：

 * 数据源标签：`w-json` `w-ajax` `w-model` ；
 * 事件关联标签：`w-on` ；

这部分的使用方法和接口请直接查看 [X-SPEC](http://fex.baidu.com/xspec/index.html)。

此外，由于需要，组件声明的方法名由 `Polymer` 变更为 `gmu`，其他接口与 `Polymer` 保持一致。

## 如何使用

### 开始

先下载项目：

 1. `git clone https://github.com/gmuteam/gmu-core.git`

之后可以参看源码：

 * src: 源代码
 * test: 测试用例
 * example: 使用示例

如果需要执行测试用例则继续执行以下步骤：

 2. `cd gmu-core`
 3. `npm install`
 4. 打开 `test/test.html` 即可

### 运行

运行组件时需要载入以下资源：

 * `platform.js` : Polymer-Project 的底层；
 * `w-core.html` : X-SPEC 通用部分的实现；
 * `w-*.html` : 组件代码，以下例子为 `w-demo.html`；

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>GMU Core DEMO</title>
        <script src="../bower_components/platform/platform.js"></script>
        <link rel="import" href="../src/w-core.html">
        <link rel="import" href="w-demo.html">
    </head>
    <body>
        <w-demo>
            <h1>GMU Core DEMO</h1>
        </w-demo>
    </body>
</html>
```

### 定义组件

```html
<polymer-element name="w-demo" extends="w-core">
  <template>
    <content></content>
  </template>
  <script>
    gmu('w-demo', {
        hidden: false,

        hide: function() {
            this.style.display = 'none';
            this.hidden = true;
        },

        show: function() {
            this.style.display = 'block';
            this.hidden = true;
        },

        toggle: function() {
            this.hidden ? this.show() : this.hide();
        }
    });
  </script>
</polymer-element>
```

## Helper 方法

GMU 3.0 Core 不依赖第三方 DOM 操作类库，因此实现了部分 Helper 方法。

### `gmu.mixin`

### `gmu.find`

### `gmu.bind`

### `gmu.addEvent`

### `gmu.toArray`