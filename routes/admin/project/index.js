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
    console.log(currentPage);
    console.log(requestinfo);
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
        title: '编辑项目'
    });
}
exports.doadd = function*() {
    var info = this.request.body;

    var project = new ProjectModel(info);

    yield thunkify(project.save, project);

    this.send(null, 0, "保存成功");

}
