'use strict';

var ProjectModel = require('../../../viewmodels/project');
var thunkify = require('thunkify-wrap');
var adminbaserender = require('../../../lib/middlewares/adminbaserender');
let koaMongoosePagination = require('koa-mongoose-pagination');


//项目列表
exports.showindex = function*() {

    const resultsPerPage = 1;
    const currentPage = 1; // You should use this.query.page here
    console.log('2');
     var result=   yield ProjectModel.paginate({
            conditions: { 'status': -1 }, // Only enabled items
            columns: '', // Retrieve only those columns
            sortBy: { '_id': -1 }, // Sort by _id DESC
            limit: resultsPerPage,
            offset: (currentPage * resultsPerPage) - resultsPerPage
        });
    console.log(result);
    console.log(koaMongoosePagination);


    yield adminbaserender(this, "admin/project/index", {
        title: '项目列表',
        pagination : { page: currentPage, limit:resultsPerPage,totalRows: 20}
    });
}
//添加项目
exports.showadd = function*() {
    yield adminbaserender(this, "admin/project/add", {
        title: '编辑项目'
    });
}
exports.doadd = function*() {
    console.log('ceshi');
    var info = this.request.body;
    console.log(info);
    var project = new ProjectModel(info);

    yield thunkify(project.save, project);

    this.send(null, 0, "保存成功");

}
