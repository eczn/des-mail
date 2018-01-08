// index.js
const mix = require('./tpl')
    , sender = require('./sender')
    , desMail = {}

/**
 * @description 输出
 */
module.exports = desMail; 

/**
 * 挂属性 
 */
desMail.mix = mix; 
desMail.sender = sender; 
