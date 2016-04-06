var co = require('co');

    "use strict";

    var later = require('later'),

        monitoringinfo = require('../../config').event.eventlist.monitoringinfo,

        WechatAPI = require('../Wechat/wechatapi');


    function *sendTemplate() {

            var templateId = monitoringinfo.templateid;

            var openid = 'obz_jjijDaOTnppDpFmh_MgfTMls';

            var url = 'http://weixin.qq.com/download';

            var topColor = '#FF0000'; // 顶部颜色


            // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
            var data = {

                "first": {
                    "value": "尊敬的欧安派3月活动项目组同事，你们好！",
                    "color": "#173177"
                },
                "keyword1": {
                    "value": "欧安派3月活动",
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


            console.log(openid);
            console.log(templateId);
            // console.log(WechatAPI);
            // var result = yield WechatAPI.sendTemplate(openid, templateId, url, topColor, data);

            // console.log(result);

    }


    var g = sendTemplate();


    module.exports = function() {

        later.date.localTime();


        var sched = later.parse.recur().every(monitoringinfo.second).second(),
            t = later.setInterval(
                function() {
                    co(doevent);
                }, sched);

        var doevent=function *() {

            var templateId = monitoringinfo.templateid;

            var openid = 'obz_jjijDaOTnppDpFmh_MgfTMls';

            var url = 'http://weixin.qq.com/download';

            var topColor = '#FF0000'; // 顶部颜色


            // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
            var data = {

                "first": {
                    "value": "尊敬的欧安派3月活动项目组同事，你们好！",
                    "color": "#173177"
                },
                "keyword1": {
                    "value": "欧安派3月活动",
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


            // console.log(openid);
            // console.log(templateId);
            console.log(data);

            var result = yield * WechatAPI.sendTemplate(openid, templateId, url, topColor, data);

            console.log(result);
        }

       
    }
sendTemplate();