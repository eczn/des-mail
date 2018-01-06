// index.js
const md = require('../md')
    , fs = require('then-fs')
    , path = require('path')
    , cssRender = require('../css-render')
    , _ = require('ramda')
    , tpl = require('tplser')


let readAndRender = _.pipe(
    fs.readFileSync.bind(fs), 
    e => e.toString(), 
    md.render.bind(md)
); 

/**
 * @type a -> b -> c
 */
let inThe = base => file => path.join(base, file); 

/**
 * @description 读取文件 file 用 theme 去渲染 并返回结果 
 * @param {String} file
 * @param {String} theme
 */
function mix(file, theme){
    // Theme Base 
    let themeBase = path.join(__dirname, theme); 
    let inTheTheme = inThe(themeBase); 

    // CSS Render 
    let css = fs.readFileSync(inTheTheme('theme.css')).toString();
    let addCss = cssRender(css);

    // Tpl Render 
    let tplRender = tpl.fromFile(
        inTheTheme('index.html'), 
        {
            noCache: true
        }
    ); 
    
    // Mixed 
    let html = readAndRender(file); 
    let after = addCss(tplRender({ html })); 

    return after; 
}

mix.outter = tpl.fromFile(
    path.join(__dirname, 'outter.html'),
    {
        noCache: true
    }
); 

mix.list = tpl.fromFile(
    path.join(__dirname, 'list.html'), 
    {
        noCache: true
    }
); 

let readCssList = _.pipeP(
    fs.readdir.bind(fs), 
    _.map(e => {
        let t = path.join(__dirname, e); 
        return fs.stat(t).then(stat => {
            return {
                themeName: e, 
                stat: stat
            }
        })
    }), 
    Promise.all.bind(Promise)
); 

let onlyDir = _.filter(e => e.stat.isDirectory()); 

let getThemeNames = _.map(
    _.prop('themeName')
); 

mix.themeList = readCssList(__dirname)
    .then(onlyDir)
    .then(getThemeNames); 

module.exports = mix; 
