就发邮件 

# config.js 

要使用得写 config.js 到项目根目录 

``` js
// config.js
const path = require('path')

module.exports = {
    tpl: path.join(__dirname, './tpl'), 
    auth: {
        user: 'abc@def.com', 
        pass: '******'
    }
}
```

# 目前的使用 

首先 npm install 一下 

``` bash 
$ npm install 
```

## 发送测试文章 

编写 `test.js` 到项目根目录测试测试 

``` js
// test.js
const mix = require('./tpl')
    , sender = require('./sender')

// 选择你的 markdown 文件 
// 渲染成 january 主题 
let after = mix('./tpl/test.md', 'january'); 

// 发送 
sender({
    // Alice 
    from: '"abc 👻" <abc@def.com>',
    // Bob 
    to: 'myfriend@test.com',
    // 主题 
    subject: '我害怕阅读的人',
    // 文本，可省略
    text: after,
    // HTML 
    html: after
}).then(ok => {
    console.log('发送成功'); 
}); 
```

## 自定义模板主题 

需要自定义自己的主题的时候，需要打开 dev server

``` bash 
$ gulp serve 
```

打开后，就可以看主题效果了 

如果自己想要写主题，得去 tpl 下创建文件夹，更多详情请对照 january 进行编写。 

此外，由于大多数的邮件客户端不支持 link style 这些 css 引入标签，只支持内联写法；

为了让 CSS 生效，我写了个 CSS 解释器，将 CSS 以内联方式嵌入到 HTML 里，因此很多选择器的支持度不太好，而且样式之间的覆盖问题比较严重，因此样式复杂度上去了可能会引起很多问题，建议编写简单的样式布局。 

此外，des-mail 使用的模板引擎是我自写的 `tplser` 。。。。 屎味较大。。。 嗯。。。 

# 建设中

额。。。

# License 

MIT 

