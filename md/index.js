// md.js
let hljs = require('highlight.js')
  , alias = require('./alias')

hljs.configure({
	useBR: true
});

let md = require('markdown-it')({
	highlight: function (str, lang) {
		lang = alias(lang); 


		return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + '</code></pre>';
	},
	html: true,
	xhtmlOut: true,
	breaks: true,
	linkify: true,
	typographer: true
}).use(require('markdown-it-toc-and-anchor').default, {
	// markdown-it-toc-and-anchor 
});

// sub sup 
md.use(require('markdown-it-sub'));
md.use(require('markdown-it-sup'));

md.use(require('markdown-it-table-of-contents')); 

var implicitFigures = require('markdown-it-implicit-figures');
md.use(implicitFigures, {
  dataType: false,  // <figure data-type="image">, default: false 
  figcaption: true  // <figcaption>alternative text</figcaption>, default: false 
});

module.exports = md; 
