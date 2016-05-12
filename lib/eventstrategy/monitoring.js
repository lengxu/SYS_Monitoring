var co = require('co');

"use strict";

var later = require('later'),

    request = require('koa-request'),

    monitoringinfo = require('../../config').event.eventlist.monitoringinfo,

    WechatAPI = require('../Wechat/wechatapi'),

    thunkify = require('thunkify-wrap'),

    nodegrass = require('nodegrass'),

    template = require('../Wechat/template'),

    ProjectModel = require('../../viewmodels/project'),

    WechatUserModel = require('../../viewmodels/wechatuser'),

    MonitorlogModel = require('../../viewmodels/monitorlog'),

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
            var requesttime = new Date();
            nodegrass.get(url, function (data, status, headers) {
                headers.requesttime = requesttime;
                headers.responsetime = new Date();

                co(checkProject(item, data, status, headers));
            }, null, 'utf8').on('error', function (e) {
                // co(checkProject(item, e, 404));
                console.log(url);

            });

        })


    }


    var checkProject = function *(projectitem, data, status, headers) {
        // var templateId = monitoringinfo.templateid;

        var monitorlog = new MonitorlogModel();

        monitorlog.lastmonitorstatus = status;

        monitorlog.responsemessage = data;

        if (monitorlog.lastmonitorstatus != 200) {

        }
        else {
            monitorlog.responsemessage = 'OK';
        }
        // console.log(monitorlog.lastmonitorstatus);

        monitorlog.projectinfo = {
            _id: projectitem._id,
            name: projectitem.name,
            siteurl: projectitem.siteurl
        };

        monitorlog.lastmonitortime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");

        monitorlog.responsetime = headers.responsetime - headers.requesttime;

        monitorlog.responsestatus = status;

        var result = yield thunkify(monitorlog.save, MonitorlogModel);

        var monitorlogId = result[0]._id;

        if (monitorlog.lastmonitorstatus != 200) {

            //循环项目人员
            yield projectitem.participants.map(function *(participantitem) {

                if (participantitem.status == 0 && participantitem.openid) {

                    yield  template.sendMonitorTemplate(projectitem, status, participantitem.openid, monitorlogId);

                }

            })


            //循环发送需要发送sendallproject的user
            //循环项目人员

            var wechatusers = yield thunkify(WechatUserModel.findBySendAllProjectStatus, WechatUserModel)();

            yield wechatusers.map(function *(wechatuseritem) {

                if (wechatuseritem.status == 0) {

                    yield  template.sendMonitorTemplate(projectitem, status, wechatuseritem.openid, monitorlogId);
                }

            })
        }

        //更新网站状态

        var projectresult= yield thunkify(ProjectModel.findProjectMonitorByIDAndStatus, ProjectModel)(projectitem.id, status);

       yield thunkify(ProjectModel.updateProjectMonitorInfo, ProjectModel)(projectitem.id, status,projectresult);

    }

}
