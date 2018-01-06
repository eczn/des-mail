// css-parse.js
function parseBucket(css){
    let chars = css.split(''); 
    let i = 0, deep = 0, res = [], start = -1, end = -1; 
    
    for (; i < chars.length; i++){
        let char = chars[i]; 
    
        if (char === '{'){
            if (deep === 0){
                deep = deep + 1; 
                start = i; 
            } else {
                console.log('Parse Error'); 
            }
        } else if (char === '}'){
            if (deep === 1){
                deep = deep - 1; 
                
                res.push({
                    s: end, 
                    l: start, 
                    r: i
                }); 
                end = i; 
            } else {
                console.log('Parse Error'); 
            }
        }
    }

    return res; 
}

module.exports = css => {
    css = css.replace(/\/\*(.*?)\*\//g, '');
    let res = parseBucket(css); 
    
    let css_ast = res.map(({s, l, r}) => {
        return {
            el: css.substring(s, l).replace(/(\t|\n|\r|\})/g, '').trim(), 
            val: css.substring(l + 1, r).replace(/\t/g, '').trim()
        } 
    }); 

    return css_ast; 
}

