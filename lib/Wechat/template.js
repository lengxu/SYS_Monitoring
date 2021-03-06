var co = require('co');

"use strict";

var later = require('later'),

    config = require('../../config'),

    request = require('koa-request'),

    WechatAPI = require('./wechatapi'),

    monitoringinfo = require('../../config').event.eventlist.monitoringinfo,

    TemplatelogModel = require('../../viewmodels/templatelog'),

    WechatUserModel = require('../../viewmodels/wechatuser'),

    ProjectModel = require('../../viewmodels/project'),

    thunkify = require('thunkify-wrap');


exports.sendMonitorTemplate = function *(projectinfo, status, openid, monitorId) {

    var wechatuserinfo = yield thunkify(WechatUserModel.findByOpenID, WechatUserModel)(openid);


    var topColor = '#FF0000'; // 顶部颜色

    var   data = {

            "first": {
                "value": "尊敬的" + projectinfo.name + "项目组同事，你们好！",
                "color": "#173177"
            },
            "keyword1": {
                "value": projectinfo.name,
                "color": "#173177"
            },
            "remark": {
                "value": "请尽快确认",
                "color": "#173177"
            }

        };

    if (status != 200 && status != 302) {
        data.keyword2= {
            "value": '异常;状态码:' + status,
            "color": "#FF0000"
        };
    }
    else {
        data.keyword2= {
            "value": '已恢复正常;状态码:' + status,
                "color": "#FF0000"
        };
    }

    var result = yield * WechatAPI.sendTemplate(openid, monitoringinfo.monitortemplateid, projectinfo.siteurl, topColor, data);

    console.log(result);
    //记录数据库
    //发送消息日志
    var templatelog = new TemplatelogModel();

    templatelog.projectinfo = {
        _id: projectinfo._id,
        name: projectinfo.name,
        siteurl: projectinfo.siteurl
    };
    templatelog.wechatuserinfo = {
        openid: openid,
        nickname: wechatuserinfo.nickname,
        name: wechatuserinfo.userinfo.name,
    };
    templatelog.monitorloginfoId = monitorId,
        templatelog.templateId = monitoringinfo.monitortemplateid;
    templatelog.addtime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
    templatelog.sendresult = result.errmsg;

    yield thunkify(templatelog.save, TemplatelogModel);
}

exports.sendApproveTemplate = function *(projectinfo, status, wechatuserid) {
    var wechatuserinfo = yield thunkify(WechatUserModel.findByID, WechatUserModel)(wechatuserid);
    var topColor = '#FF0000'; // 顶部颜色

    var data = {

        "first": {
            "value": "尊敬的  " + wechatuserinfo.nickname + "  ，你好！",
            "color": "#173177"
        },
        "keyword1": {
            "value": projectinfo.name,
            "color": "#173177"
        },
        "keyword2": {
            "value": status == 0 ? '审核通过' : '未审核通过',
            "color": "#FF0000"
        },
        "remark": {
            "value": "请尽快解决",
            "color": "#173177"
        }

    };

    // var openid = 'obz_jjijDaOTnppDpFmh_MgfTMls';
    var openid = wechatuserinfo.openid;

    var result = yield * WechatAPI.sendTemplate(openid, monitoringinfo.approvetemplateid, config.siteinfo.host + '/member/project/' + projectinfo._id + '/detail', topColor, data);

    //记录数据库
    // //发送消息日志
    // var templatelog = new TemplatelogModel();
    //
    // templatelog.projectinfo = {
    //     _id: projectinfo._id,
    //     name: projectinfo.name,
    //     siteurl: projectinfo.siteurl
    // };
    // templatelog.wechatuserinfo = {
    //     openid:openid,
    //     nickname:wechatuserinfo.nickname,
    //     name:wechatuserinfo.userinfo.name,
    // };
    // templatelog.monitorloginfoId=monitorId,
    // templatelog.templateId = monitoringinfo.monitortemplateid;
    // templatelog.addtime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
    // templatelog.sendresult = result.errmsg;
    //
    // yield thunkify(templatelog.save, TemplatelogModel);
}