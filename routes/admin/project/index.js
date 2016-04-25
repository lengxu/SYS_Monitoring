'use strict';

var ProjectModel = require('../../../viewmodels/project');
var thunkify = require('thunkify-wrap');
var adminbaserender = require('../../../lib/middlewares/adminbaserender');
let koaMongoosePagination = require('koa-mongoose-pagination'),
    monitoringinfo = require('../../../config').event.eventlist.monitoringinfo,
    WechatAPI = require('../../../lib/Wechat/wechatapi'),
    config = require('../../../config');


//项目列表
exports.showindex = function*() {
    var requestinfo = this.request.query;


    var condition = {};

    if (requestinfo.participantsid)
    {
        condition.participants={_id:requestinfo.participantsid};
    }

    const resultsPerPage = config.paginate.resultsPerPage;
    const currentPage = requestinfo.page || 1; // You should use this.query.page here
    var result = yield ProjectModel.paginate({
        conditions: condition, // Only enabled items
        columns: '', // Retrieve only those columns
        sortBy: {'_id': -1}, // Sort by _id DESC
        limit: resultsPerPage,
        offset: (currentPage * resultsPerPage) - resultsPerPage
    });

    console.log(result);

    yield adminbaserender(this, "admin/project/index", {
        title: '项目列表',
        menuinfo:{project:"active",project_first:"active"},
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}
//添加项目
exports.showadd = function*() {
    yield adminbaserender(this, "admin/project/add", {
        title: '添加项目',
        menuinfo:{project:"active",project_second:"active"}
    });
}
exports.doadd = function*() {
    var info = this.request.body;

    var project = new ProjectModel(info);

    yield thunkify(project.save, project);

    this.send(null, 0, "保存成功");

}

//修改项目
exports.showedit = function*() {

    let info = this.params;

    var projectinfo = yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

    yield adminbaserender(this, "admin/project/edit", {

        title: '项目详情',

        menuinfo:{project:"active",project_first:"active"},

        projectinfo: projectinfo
    });
}
exports.doedit = function*() {

    var info = this.request.body;


    var project = new ProjectModel(info);


    var result = yield thunkify(ProjectModel.updateProjectinfo, ProjectModel)(project);


    this.send(null, 0, "保存成功");

}


exports.detail = function*() {
    let info = this.params;

    var projectinfo = yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

    yield adminbaserender(this, "admin/project/detail", {

        title: '项目详情',

        menuinfo:{project:"active",project_first:"active"},

        projectinfo: projectinfo,

        items: yield projectinfo.participants.map(function *(item) {
            var newitem={};
            switch  (item.status) {
                case -1:
                    newitem.getstatus = '未审核';
                    break;
                case 0:
                    newitem.getstatus = '已审核';
                    break;
                case -255:
                    newitem.getstatus = '已删除';
                    break;
                default:
                    newitem.getstatus = '未知状态';
                    break;
            }
            newitem._id=item._id;
            newitem.status=item.status;
            return newitem;
        })

    });
}

exports.doapprove = function*() {

    var info = this.request.body;

    console.log(info);

    var project = new ProjectModel(info);

    var result = yield thunkify(ProjectModel.updateParticipantStatus, ProjectModel)(info.id, info.wechatuserid, info.status);

    console.log(result);
    if(info.status==0)
    {

        var projectinfo = yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

        //发送模板消息
        console.log('66666666');

        var templateId = monitoringinfo.templateid;

        var topColor = '#FF0000'; // 顶部颜色

        // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
        var data = {

            "first": {
                "value": "尊敬的" + projectinfo.name + "项目组同事，你们好！",
                "color": "#173177"
            },
            "keyword1": {
                "value": projectinfo.name,
                "color": "#173177"
            },
            "keyword2": {
                "value": '审核通过',
                "color": "#FF0000"
            },
            "remark": {
                "value": "请尽快解决",
                "color": "#173177"
            }

        };

        var openid = 'obz_jjijDaOTnppDpFmh_MgfTMls';
        // var openid = info.wechatuserid;
         result = yield * WechatAPI.sendTemplate(openid, templateId, 'http://www.ompchina.com', topColor, data);

        console.log('77777777');

    }

    this.send(null, 0, "保存成功");

}