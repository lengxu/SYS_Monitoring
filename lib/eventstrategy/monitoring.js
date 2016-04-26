var co = require('co');

"use strict";

var later = require('later'),

    request = require('koa-request'),

    monitoringinfo = require('../../config').event.eventlist.monitoringinfo,

    WechatAPI = require('../Wechat/wechatapi'),

    thunkify = require('thunkify-wrap'),

    ProjectModel = require('../../viewmodels/project'),

    WechatUserModel = require('../../viewmodels/wechatuser'),

    MonitorlogModel = require('../../viewmodels/monitorlog'),

    nodegrass = require('nodegrass'),

    TemplatelogModel = require('../../viewmodels/templatelog');


module.exports = function () {

    later.date.localTime();


    var sched = later.parse.recur().every(monitoringinfo.second).second(),
        t = later.setInterval(
            function () {
                co(doevent);
            }, sched);

    var doevent = function *() {

        var monitorprojects = yield thunkify(ProjectModel.findMonitorProject, ProjectModel)(monitoringinfo.second);


        yield monitorprojects.map(function *(item) {

            var url = item.siteurl;
            nodegrass.get(url, function (data, status, headers) {
                // console.log(status);
                co(checkProject(item, data, status));

            }, null, 'utf8').on('error', function (e) {
                co(checkProject(item, e, 404));
            });

        })


    }


    var checkProject = function *(projectitem, data, status) {
        var templateId = monitoringinfo.templateid;

        var monitorlog = new MonitorlogModel();

        monitorlog.lastmonitorstatus = status;

        monitorlog.responsemessage = data;
        console.log(monitorlog.lastmonitorstatus);


        if (monitorlog.lastmonitorstatus != 200) {

            var topColor = '#FF0000'; // 顶部颜色

            // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
            var data = {

                "first": {
                    "value": "尊敬的" + projectitem.name + "项目组同事，你们好！",
                    "color": "#173177"
                },
                "keyword1": {
                    "value": projectitem.name,
                    "color": "#173177"
                },
                "keyword2": {
                    "value": '异常;statuscode:' + monitorlog.lastmonitorstatus,
                    "color": "#FF0000"
                },
                "remark": {
                    "value": "请尽快解决",
                    "color": "#173177"
                }

            };

            //循环项目人员
            yield projectitem.participants.map(function *(participantitem) {

                if (participantitem.status == 0) {

                    var openid = 'obz_jjijDaOTnppDpFmh_MgfTMls';
                    // var openid = participantitem._id.openid;

                    var result = yield * WechatAPI.sendTemplate(openid, templateId, projectitem.siteurl, topColor, data);

                    //记录数据库
                    //发送消息日志
                    var templatelog = new TemplatelogModel();

                    templatelog.projectinfo = {
                        _id: projectitem._id,
                        name: projectitem.name,
                        siteurl: projectitem.siteurl
                    };

                    templatelog.openid = participantitem._id.openid;
                    templatelog.templateId = templateId;
                    templatelog.addtime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
                    templatelog.sendresult = result.errmsg;

                    yield thunkify(templatelog.save, TemplatelogModel);

                }

            })


            //循环发送需要发送sendallproject的user
            //循环项目人员

            var wechatusers = yield thunkify(WechatUserModel.findBySendAllProjectStatus, WechatUserModel)();


            yield wechatusers.map(function *(wechatuseritem) {


                if (wechatuseritem.status == 0) {

                    var openid = 'obz_jjijDaOTnppDpFmh_MgfTMls';
                    // var openid = wechatuseritem.openid;
                    var result = yield * WechatAPI.sendTemplate(openid, templateId, projectitem.siteurl, topColor, data);
                    //记录数据库
                    //发送消息日志
                    var templatelog = new TemplatelogModel();

                    templatelog.projectinfo = {
                        _id: projectitem._id,
                        name: projectitem.name,
                        siteurl: projectitem.siteurl
                    };

                    templatelog.openid = wechatuseritem.openid;
                    templatelog.templateId = templateId;
                    templatelog.addtime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
                    templatelog.sendresult = result.errmsg;

                    yield thunkify(templatelog.save, TemplatelogModel)


                }

            })
        }
        else {
            monitorlog.responsemessage = 'OK';
        }
        console.log(monitorlog.lastmonitorstatus);

        monitorlog.projectinfo = {
            _id: projectitem._id,
            name: projectitem.name,
            siteurl: projectitem.siteurl
        };

        monitorlog.lastmonitortime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");

        monitorlog.lastmonitorstatus = 0;

        monitorlog.responsetime = 10;

        monitorlog.responsestatus = status;


        yield thunkify(monitorlog.save, MonitorlogModel);

        //更新网站状态
        yield thunkify(ProjectModel.updateProjectMonitorInfo, ProjectModel)(projectitem.id, status);

    }

}
