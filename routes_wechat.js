"use strict";

var wechat = require('./routes/wechat/index');
var wechatmedia = require('./routes/wechat/media');
var wechatqrcode = require('./routes/wechat/qrcode');
var wechatgroup = require('./routes/wechat/group');
var wechatip = require('./routes/wechat/ip');
var auth = require('./lib/middlewares/auth');
var wechatoauth = require('./lib/middlewares/wechatoauth');

module.exports = function(router) {

	router.get('/wechat/', wechatoauth.view(),wechat.getwechatlogin);

	router.get('/wechat/callback',  wechat.callback);


	//测试上传多媒体文件
	router.get('/wechat/media', wechatmedia.index);
	router.post('/wechat/media/get', wechatmedia.getMedia);

	//api_qrcode: 
	router.get('/wechat/qrcode/createTmpQRCode', wechatqrcode.createTmpQRCode);
	router.get('/wechat/qrcode/createLimitQRCode', wechatqrcode.createLimitQRCode);
	router.get('/wechat/qrcode/showQRCodeURL', wechatqrcode.showQRCodeURL);

	//api_group: 
	router.get('/wechat/group/getGroups', wechatgroup.getGroups);
	router.get('/wechat/group/getWhichGroup', wechatgroup.getWhichGroup);
	router.get('/wechat/group/createGroup', wechatgroup.createGroup);

	//api_ip: 
	router.get('/wechat/ip/getIp', wechatip.getIp);


}
