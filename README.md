# Read me

  Fast, easy use javascript template engine based on [node](http://nodejs.org).

```js
var nodetpl = require('nodetpl');

var output, input;
input = '<?if(true){?>Now is <?=new Date()?>.<?}?>';
output = nodetpl.precompile(input);

console.log(nodetpl.templete('/test-tpl.js', output);
```

## Installation

    $ npm install nodetpl

## Quick Start

Nothing.