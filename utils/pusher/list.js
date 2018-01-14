// list.js
const fs = require('then-fs')
    , path = require('path')
    , LIST_BASE = __dirname
    , CACHE_FILE = './list-cache.json'
    , CACHE_LOCALTION = path.join(LIST_BASE, CACHE_FILE)


let list = {}

module.exports = list; 

list.store = function(){
    let content = JSON.stringify(this.cache); 

    fs.writeFileSync(CACHE_LOCALTION, content); 
}

list.find = function(key){
    return this.cache[key] || null; 
}

list.add = function(key, val){
    this.cache[key] = val; 
    this.store(); 
}


try {
    let content = fs.readFileSync(CACHE_LOCALTION).toString();
    list.cache = JSON.parse(content); 
} catch (err){
    list.cache = {}; 
    list.store(); 
}
