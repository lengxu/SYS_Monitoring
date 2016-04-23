'use strict';

var WechatUserModel = require('../../../viewmodels/wechatuser');
var thunkify = require('thunkify-wrap');
var adminbaserender = require('../../../lib/middlewares/adminbaserender');
let koaMongoosePagination = require('koa-mongoose-pagination'),
    config = require('../../../config');

//成员列表
exports.showindex = function*() {

    var requestinfo = this.request.query;

    var condition = {};

    const resultsPerPage = config.paginate.resultsPerPage;
    const currentPage = requestinfo.page || 1; // You should use this.query.page here
    var result = yield WechatUserModel.paginate({
        conditions: condition, // Only enabled items
        columns: '', // Retrieve only those columns
        sortBy: {'_id': -1}, // Sort by _id DESC
        limit: resultsPerPage,
        offset: (currentPage * resultsPerPage) - resultsPerPage
    });

    yield adminbaserender(this, "admin/member/index", {
        title: '成员列表',
        menuinfo: {member: "active", member_first: "active"},
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}

exports.doupdatestatus = function*() {

    var info = this.request.body;

    var result = yield thunkify(WechatUserModel.updateUserStatus, WechatUserModel)(info.wechatuserid,info.status);
    console.log(result);

    this.send(null, 0, "保存成功");

}

exports.doupdatesendallprojectstatus = function*() {
    var info = this.request.body;
    var result = yield thunkify(WechatUserModel.updateUserSendAllProjectStatus, WechatUserModel)( info.wechatuserid, info.status);
console.log(result);
    this.send(null, 0, "保存成功");

}