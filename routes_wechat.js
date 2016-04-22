"use strict";

var wechat = require('./routes/wechat/index');
var wechatmedia = require('./routes/wechat/media');
var wechatqrcode = require('./routes/wechat/qrcode');
var wechatgroup = require('./routes/wechat/group');
var wechatip = require('./routes/wechat/ip');
var project = require('./routes/member/project/index');
var member = require('./routes/member/info/index');
var auth = require('./lib/middlewares/auth');
var wechatoauth = require('./lib/middlewares/wechatoauth');



module.exports = function (router) {

    router.get('/wechat/', wechatoauth.view(), wechat.getwechatlogin);

    router.get('/wechat/callback', wechat.callback);

    router.get('/wechat/settestlogin', wechat.settestlogin);


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

    //未登陆pc端查看
    router.get('/project/:id?/detail',  project.detail);

    router.get('/member/project/', wechatoauth.infoview(), project.showindex);
    router.get('/member/project/:id?/detail', wechatoauth.infoview(), project.detail);
    router.post('/member/project/doapply', wechatoauth.infoapi(), project.doapply);

    //用户信息
    router.get('/member/info/detail', wechatoauth.infoview(), member.detail);
    router.get('/member/info/add', wechatoauth.view(), member.showadd);
    router.post('/member/info/doadd', wechatoauth.api(), member.doadd);
    router.get('/member/info/edit', wechatoauth.infoview(), member.edit);
    router.post('/member/info/doedit', wechatoauth.infoapi(), member.doedit);






}
