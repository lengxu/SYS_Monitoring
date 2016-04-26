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

    if(browserinfo.isMicroMessenger)
    {
        this.redirect('/member/project/'+info.id+"/detail");
        return;
    }

    var projectinfo = yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

    yield siterender(this, "project/index", {
        title: '项目详情',
        projectinfo: projectinfo

    });
}
