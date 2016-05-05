'use strict';

var ProjectModel = require('../../../viewmodels/project'),
    MonitorlogModel= require('../../../viewmodels/monitorlog');
var thunkify = require('thunkify-wrap');
var adminbaserender = require('../../../lib/middlewares/adminbaserender');
let koaMongoosePagination = require('koa-mongoose-pagination'),
    monitoringinfo = require('../../../config').event.eventlist.monitoringinfo,
    WechatAPI = require('../../../lib/Wechat/wechatapi'),
    template=require('../../../lib/Wechat/template'),
    config = require('../../../config');


//项目列表
exports.showindex = function*() {
    var requestinfo = this.request.query;


    var condition = {};

    if (requestinfo.participantsid) {
        condition.participants = {_id: requestinfo.participantsid};
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
        menuinfo: {project: "active", project_first: "active"},
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}
//添加项目
exports.showadd = function*() {
    yield adminbaserender(this, "admin/project/add", {
        title: '添加项目',
        menuinfo: {project: "active", project_second: "active"}
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

        menuinfo: {project: "active", project_first: "active"},

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

        menuinfo: {project: "active", project_first: "active"},

        projectinfo: projectinfo,

        items: yield projectinfo.participants.map(function *(item) {
            var newitem = {};
            switch (item.status) {
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
            newitem._id = item._id;
            newitem.status = item.status;
            return newitem;
        })

    });
}

exports.doapprove = function*() {

    var info = this.request.body;

    console.log(info);

    var project = new ProjectModel(info);

    var result = yield thunkify(ProjectModel.updateParticipantStatus, ProjectModel)(info.id, info.wechatuserid, info.status);

    var projectinfo = yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

    yield  template.sendApproveTemplate(projectinfo, info.status, info.wechatuserid);

    this.send(null, 0, "保存成功");

}


//监控日志列表
exports.showmonitor = function*() {

    let info = this.params;
    var requestinfo = this.request.query;
    const resultsPerPage = config.paginate.resultsPerPage;
    const currentPage = requestinfo.page || 1; // You should use this.query.page here

    var result = yield MonitorlogModel.paginate({
        // columns: '', // Retrieve only those columns
        conditions: {'projectinfo._id':info.projectid},
        sortBy: {'_id': -1}, // Sort by _id DESC
        limit: resultsPerPage,
        offset: (currentPage * resultsPerPage) - resultsPerPage
    });
    console.log(result);
    yield adminbaserender(this, "admin/project/monitor", {
        title: '项目_监控日志',
        menuinfo:{project:"active",project_first:"active"},
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}