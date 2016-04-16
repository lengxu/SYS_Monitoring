'use strict';

var ProjectModel = require('../../../viewmodels/project'),
    WechatUserModel = require('../../../viewmodels/wechatuser');
var thunkify = require('thunkify-wrap');
var baserender = require('../../../lib/middlewares/baserender'),
    mongoose = require('mongoose'),
    koaMongoosePagination = require('koa-mongoose-pagination'),
    Schema = mongoose.Schema,
    config = require('../../../config');


//项目列表
exports.showindex = function*() {

    var requestinfo = this.request.query;
    const resultsPerPage = config.paginate.resultsPerPage;
    const currentPage = requestinfo.page || 1; // You should use this.query.page here
    var result = yield ProjectModel.paginate({
        // columns: '', // Retrieve only those columns
        conditions: {},
        sortBy: {'_id': -1}, // Sort by _id DESC
        limit: resultsPerPage,
        offset: (currentPage * resultsPerPage) - resultsPerPage
    });
    console.log(result.data[0].participants);


    var wxUsers = result.data[0].participants.map(function (item) {
        console.log(item._id);
        return yield thunkify(WechatUserModel.findByID, WechatUserModel)(item._id);

    });
    console.log(wxUsers);

    yield baserender(this, "member/project/index", {
        title: '我的项目',
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}

exports.detail = function*() {
    let info = this.params;

    var result = yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

    result = yield thunkify(ProjectModel.updateParticipants, ProjectModel)(result._id,
        {
            _id: this.session.wechatUserInfo._id,
            'status': -1
        }
    );



    yield baserender(this, "member/project/detail", {
        title: '项目详情',

        info: result

    });
}
