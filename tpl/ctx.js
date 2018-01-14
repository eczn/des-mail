// ctx.js
const fs = require('then-fs')
    , config = require('../config')

let ctx = {
    imgList: function(){
        let { imgPool } = config; 

        return fs.readdirSync(imgPool); 
    },
    pusher: require('../utils/pusher')
};

module.exports = ctx; 
