// index.js
'use strict';
const nodemailer = require('nodemailer')
	, { auth } = require('./config')

let transporter = nodemailer.createTransport({
	host: 'smtp.exmail.qq.com', 
	port: 465, 
	secure: true, 
	auth: Object.assign({
		type: "login" // 'oauth2'
	}, auth)
}); 

/**
 * @description 发送邮件给 to 
 * @param {String} to 
 * @param {md} 文本
 * @returns {Promise<Object>} 结果 
 */
function sender(to, subject, md){
	// setup email data with unicode symbols
	let mailOptions = {
		from: '"desEczn 👻" <eczn@moebaka.com>', // sender address
		to: to, // list of receivers
		subject: subject, // Subject line
		text: md, // plain text body
		html: md // html body
	};

	// send mail with defined transport object
	return new Promise((res, rej) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				rej(error)
			} else {
				res(info)
			}
		});
	})
}

module.exports = sender;
