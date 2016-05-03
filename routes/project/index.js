'use strict';

var ProjectModel = require('../../viewmodels/project'),
    WechatUserModel = require('../../viewmodels/wechatuser');
var thunkify = require('thunkify-wrap');
var siterender = require('../../lib/middlewares/siterender'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    co = require('co'),
    config = require('../../config');


exports.detail = function*() {
    let info = this.params;

    var browser = require('beyond-lib/lib/browser');
    var browserinfo = browser.parse(this.request.header["user-agent"]);

    //判断微信跳转
    if(browserinfo.isMicroMessenger)
    {
        this.redirect('/member/project/'+info.id+"/detail");
        return;
    }

    //获取项目详情
    var projectinfo = yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);


    var fs = require('co-fs');

    var hasdir = yield fs.exists('/public/upload/qrcode/'+info.id+'.png');
    var qrcodeurl='';

    if (!hasdir) {


        //生成二维码
        var qrcode = require('node-qrcode'),
            siteinfo = require('../../config').siteinfo;

        qrcode({
            text: siteinfo.host + '/member/project/' + info.id + '/detail',
            size: 200,
            qrcodePath: './public/upload/qrcode/' + info.id + '.png'
        }).then(function (qrcodePath) {
            console.log('222' + qrcodePath);  // balabala/node-qrcode/qrcode.png
            qrcodeurl = qrcodePath;
        });
        console.log('1111' + qrcodeurl);  // balabala/node-qrcode/qrcode.png

    }
    yield siterender(this, "project/index", {
        title: '项目详情',
        projectinfo: projectinfo

    });
}
