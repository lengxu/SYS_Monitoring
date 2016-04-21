'use strict';

var ProjectModel = require('../../../viewmodels/project');
var thunkify = require('thunkify-wrap');
var adminbaserender = require('../../../lib/middlewares/adminbaserender');
let koaMongoosePagination = require('koa-mongoose-pagination'),
    config = require('../../../config');


//项目列表
exports.showindex = function*() {
    var requestinfo = this.request.query;
    const resultsPerPage = config.paginate.resultsPerPage;
    const currentPage = requestinfo.page || 1; // You should use this.query.page here
    var result = yield ProjectModel.paginate({
        // conditions: { 'status': -1 }, // Only enabled items
        columns: '', // Retrieve only those columns
        sortBy: {'_id': -1}, // Sort by _id DESC
        limit: resultsPerPage,
        offset: (currentPage * resultsPerPage) - resultsPerPage
    });
    yield adminbaserender(this, "admin/project/index", {
        title: '项目列表',
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}
//添加项目
exports.showadd = function*() {
    yield adminbaserender(this, "admin/project/add", {
        title: '添加项目'
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

    var projectinfo=yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

    yield adminbaserender(this, "admin/project/edit", {

        title: '项目详情',

        projectinfo: projectinfo
    });
}
exports.doedit = function*() {

    var info = this.request.body;


    var project = new ProjectModel(info);

    console.log(project);

    var result=  yield thunkify(ProjectModel.updateProjectinfo, ProjectModel)(project);

    console.log(result);

    this.send(null, 0, "保存成功");

}


exports.detail = function*() {
    let info = this.params;

    var projectinfo=yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

    yield adminbaserender(this, "admin/project/detail", {

        title: '项目详情',

        projectinfo: projectinfo,

        items: projectinfo.participants

    });
}

exports.doapprove = function*() {

    var info = this.request.body;

    console.log(info);

    var project = new ProjectModel(info);

   var result= yield thunkify(ProjectModel.updateParticipantStatus, ProjectModel)(info.id,info.wechatuserid,info.status);

    this.send(null, 0, "保存成功");

}