const cheerio = require('cheerio')
    , parse = require('./parse')

module.exports = css => {
    let ast = parse(css); 

    return html => {
        let $ = cheerio.load(html); 

        ast.forEach(({el, val}) => {
            $(el).each((idx, elem) => {
                let $elem = $(elem); 
                let pre = $elem.attr('style') || ''; 

                $elem.attr('style', pre + val);
            })
        })

        return $('body').html(); 
    }
}
