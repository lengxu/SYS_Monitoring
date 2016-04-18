var co = require('co');

"use strict";

var later = require('later'),

    monitoringinfo = require('../../config').event.eventlist.monitoringinfo,

    WechatAPI = require('../Wechat/wechatapi'),

    thunkify = require('thunkify-wrap'),

    ProjectModel = require('../../viewmodels/project'),

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


        var templateId = monitoringinfo.templateid;

        yield monitorprojects.map(function *(item) {

            var url = item.siteurl;

            var topColor = '#FF0000'; // 顶部颜色

            // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
            var data = {

                "first": {
                    "value": "尊敬的" + item.name + "项目组同事，你们好！",
                    "color": "#173177"
                },
                "keyword1": {
                    "value": item.name,
                    "color": "#173177"
                },
                "keyword2": {
                    "value": "BM2001200",
                    "color": "#173177"
                },
                "keyword3": {
                    "value": "第二期",
                    "color": "#173177"
                },
                "keyword4": {
                    "value": "网站出错",
                    "color": "#173177"
                },
                "remark": {
                    "value": "请尽快解决",
                    "color": "#173177"
                }

            };

            console.log(data);

            yield item.participants.map(function *(participantitem) {


                var openid = 'obz_jjijDaOTnppDpFmh_MgfTMls';

                var result = yield * WechatAPI.sendTemplate(openid, templateId, url, topColor, data);

                //记录数据库
                //发送消息日志
                var templatelog = new TemplatelogModel();

                templatelog.projectinfo = {
                    _id: item._id,
                    name: item.name,
                    siteurl: item.siteurl
                };

                templatelog.openid=participantitem.openid;
                templatelog.templateId=templateId;
                templatelog.addtime= new Date().toFormat("YYYY-MM-DD HH24:MI:SS");
                templatelog.sendresult=result.errmsg;

                yield thunkify(templatelog.save, TemplatelogModel);

            })

            //保存监控日志
            var monitorlog = new MonitorlogModel();

            monitorlog.projectinfo = {
                _id: item._id,
                name: item.name,
                siteurl: item.siteurl
            };

            monitorlog.lastmonitortime=new Date().toFormat("YYYY-MM-DD HH24:MI:SS");

            monitorlog.lastmonitorstatus=0;

            monitorlog.responsetime=10;

            monitorlog.responsemessage='OK';

            monitorlog.responsestatus='';

            yield thunkify(monitorlog.save, MonitorlogModel);


        })


    }


}
