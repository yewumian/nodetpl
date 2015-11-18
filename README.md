## 为什么使用 nodetpl ？

  * 性能超群，运行速度超快，闪电一样的解析效率
  * 扩展性强，支持自定义 tag、root，支持 seajs 等 CMD 模块化开发
  * 支持预编译，提前编译成 js 文件，减轻浏览器运行负担
  * 支持原生 js 语法，不再像学一门新语言一样痛苦
  * 支持复杂的多模板，include 一步到位
  * 支持模板自身CSS/JS，独创CSS/JS随包机制，独立的模板可以拥有自身CSS/JS，并可以有效解决命名冲突问题
  * 兼容所有主流浏览器
  * 可以运行在 node 端，支持 Express.js
  * 学习成本低，从入门到精通仅需 10 分钟

## 快速上手

### 引入文件

在页面 head 标签内，引入 nodetpl 客户端文件：

```html
<script src="./static/js/nodetpl.client.js"></script>
```

### 编写模板

最简单的，可以使用一个 type="text/template" 的 script 标签存放模板：

```html
<script id="testid" type="text/template">
<h1><?=title?></h1>
<ul>
  <?for(var i=0; i<favor.length; i++){?>
    <li><?=i?>：<?=favor[i]?></li>
  <?}?>
</ul>
</script>
```

### 执行渲染

```js
var data = {
  title: '个人爱好',
  favor: ['足球', '篮球', '乒乓球', '琉璃球']
};
var content = document.getElementById('testid').innerHTML;
var html = nodetpl.render(content, data);
alert(html);
```

### 运行结果

```html
<h1>个人爱好</h1>
<ul>
  <li>0：足球</li>
  <li>1：篮球</li>
  <li>2：乒乓球</li>
  <li>3：琉璃球</li>
</ul>
```

### 详细文档

  http://www.nodetpl.com

### License

  [MIT](LICENSE)