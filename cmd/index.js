#!/usr/bin/env node 
const argv = process.argv.slice(2)
	, [ operation = 'default', ...params ] = argv
	, path = require('path')
	, BASE = path.join(__dirname, '../')
	, fs = require('then-fs')
	, mkdir = require('../build/mkdir')

let todos = {
	default: () => {
		console.log('des-mail help: '); 
		console.log('- dmail new [newWhat] [toNew]'); 
	}, 
	new: (newWhat) => {
		let TPL_BASE = path.join(BASE, './tpl'); 
		let NEW_THEME_BASE = path.join(TPL_BASE, newWhat); 

		let isExists = fs.existsSync(NEW_THEME_BASE); 

		if (isExists) {
			console.log(`The theme ${newWhat} Exists.`); 
		} else {
			mkdir(NEW_THEME_BASE); 

			Promise.all(
				[
					{
						name: 'index.html', 
						data: `<!-- created by des-mail cli -->\n{{ html }}\n`
					}, {
						name: 'theme.css', 
						data: `/* created by des-mail cli */\n`
					}, {
						name: 'info.json', 
						data: `{\n\t"name": "${newWhat}"\n}`
					}
				].map(({name, data}) => {
					let target = path.join(NEW_THEME_BASE, name); 

					return fs.writeFile(target, data); 
				})
			).then(allDone => {
				return fs.readdir(NEW_THEME_BASE); 
			}).then(list => {
				console.log('Created Succ'); 
				list.map(e => path.join(NEW_THEME_BASE, e)).forEach(file => {
					console.log(`- ${file}`); 
				}); 
			}); 
		}
	}
}

todos[operation].apply(this, params); 
