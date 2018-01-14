// index.js
'use strict';
const nodemailer = require('nodemailer')
	, path = require('path')
	, cheerio = require('cheerio')
	, { auth, mailBase } = require('../config')
	, pusher = require('../utils/pusher')

let transporter = nodemailer.createTransport({
	host: 'smtp.exmail.qq.com', 
	port: 465, 
	secure: true, 
	auth: Object.assign({
		type: "login" // 'oauth2'
	}, auth)
}); 

/**
 * @description 发送邮件
 * @param {Object} mailOptions 
 * @returns {Promise<Object>} 结果 
 */
function sender(mailOptions){
	// send mail with defined transport object
	let $ = cheerio.load(mailOptions.html); 

	let todos = []; 

	$('img, image-for-upload').each((idx, elem) => {
		let URL_BASE = $(elem).attr('src'); 
		let FILE_LOCALTION = path.join(mailBase, URL_BASE);
		let LOCAL_FILE = path.parse(FILE_LOCALTION); 
		let FILE_NAME = LOCAL_FILE.name + LOCAL_FILE.ext; 

		let thisImg = pusher.uploadFile(FILE_LOCALTION, 'des-mail/' + FILE_NAME).then(resp => {
			let { url } = resp; 
			$(elem).attr('src', url); 

			return resp;
		}); 
		
		todos.push(thisImg);
	}); 

	$('image-for-upload').remove();

	return Promise.all(todos).then(all_upload_success => {
		mailOptions.html = $('body').html();

		return new Promise((res, rej) => {
			transporter.sendMail(mailOptions, (error, info) => {
				error ? rej(error) : res(info); 
			});
		})
	})
}

module.exports = sender;
