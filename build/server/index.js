// server.js 
const gulp = require('gulp')
    , connect = require('gulp-connect')
    , path = require('path')
    , BASE = path.join(__dirname, '../../')
    , join = b => path.join(BASE, b)
    , WWW_BASE = join('dist')
    , mix = require('../../tpl')
    , mkdir = require('../mkdir')
    , _ = require('ramda')
    , fs = require('then-fs')
    , CONFIG = require('../../config')

// mkdir dir 
mkdir(WWW_BASE); 
mkdir(path.join(WWW_BASE, 'themes')); 

let HTMLS = () => mix.themeList.then(l => {
    let file = join('tpl/test.md'); 

    let htmls = l.map(theme => {
        let html = mix.outter({ 
            html: mix(file, theme)
        }); 

        return {
            theme: theme, 
            html: html
        }
    }); 

    return htmls; 
})

let writeOneFile = _.map(({theme, html}) => {
    return fs.writeFile(
        path.join(BASE, `dist/themes/${theme}.html`), 
        html
    ); 
})

function writeTheme(){
    return HTMLS().then(list => {
        let all = writeOneFile(list);

        return Promise.all(all);
    }); 
}

function listRender(){
    return HTMLS().then(list => {
        return mix.list({
            list
        })
    })
}

function saveAsIndex(e){
    return fs.writeFile(
        path.join(WWW_BASE, 'index.html'), 
        e
    ); 
}

/**
 * @description 复制全部文件 
 */
function WWW(){
    return Promise.all([
        listRender().then(saveAsIndex), 
        writeTheme()
    ]); 
}


let ALL_WWW_BASE = [
    path.join(WWW_BASE, '**/*')
];

let ALL_WWW_BASE_HTML = [
    path.join(WWW_BASE, '**/*.html')
]

let ALL_TPL_BASE = [
    path.join(BASE, 'tpl/**/*')
]; 


gulp.task('reload', function(){
    let temp = [
        'dist/**/*.html'
    ];

    return gulp.src(temp).pipe(connect.reload()); 
}); 

function serverInit(){
    connect.server({
        root: [WWW_BASE, CONFIG.mailBase],
        port: 4455,
        livereload: true
    });
    
    gulp.watch(ALL_WWW_BASE, ['reload']); 
    gulp.watch(ALL_TPL_BASE, ['www']); 
}


/**
 * @description init and start server
 */
gulp.task('serve', function(){
    WWW().then(serverInit); 
}); 


gulp.task('www', WWW); 