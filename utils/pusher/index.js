// pusher.js
// upload.js
const qiniu = require('qiniu')
	, path = require('path')
	, config = require('../../config')
	, fs = require('fs')
	, QINIU_CONFIG = new qiniu.conf.Config()
	, list = require('./list')

// Config 
const { ACCESS_KEY, SECRET_KEY, bucket, bucket_domain } = config.qiniu; 

// Set Zone 
QINIU_CONFIG.zone = qiniu.zone.Zone_z2; 

const mac = new qiniu.auth.digest.Mac(
	ACCESS_KEY,
	SECRET_KEY
);

const bucketManager = new qiniu.rs.BucketManager(mac, QINIU_CONFIG);


// Exports 
let pusher = {}; 

module.exports = pusher; 

// 构建上传策略函数
let getUptoken = key => {
	const uploadOpt = {
		scope: bucket + ":" + key
	}; 
	
	let putPolicy = new qiniu.rs.PutPolicy(uploadOpt);

	return putPolicy.uploadToken(mac);
}

// 构造上传函数
let uploadFile = (localFile, key) => {
	// list
	let LOCAL_FILE = path.parse(localFile); 
	let FILE_NAME = LOCAL_FILE.name + LOCAL_FILE.ext; 

	console.log('[ Uploading ]', FILE_NAME); 

	if (list.find(FILE_NAME)){
		// 命中 
		console.log('[ From Cache ]', list.find(FILE_NAME).url); 

		return Promise.resolve(list.find(FILE_NAME)); 
	} else {
		let extra = new qiniu.form_up.PutExtra();
		let formUploader = new qiniu.form_up.FormUploader(
			QINIU_CONFIG
		);
		
		let uptoken = getUptoken(key);
	
		return new Promise((res, rej) => {
			formUploader.putFile(uptoken, key, localFile, extra, function(err, ret) {
				err ? rej(err) : res(ret); 
			})
		}).then(ret => {
			ret.url = pusher.getDownUrl(key); 
			list.add(FILE_NAME, ret); 

			console.log('[ Upload Succ ]', ret.url); 

			return ret; 
		})
	}
}

pusher.uploadFile = uploadFile; 
pusher.getDownUrl = function(key){
	return bucketManager.publicDownloadUrl(bucket_domain, key); 
}
