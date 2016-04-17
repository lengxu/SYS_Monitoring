'use strict';

var ProjectModel = require('../../../viewmodels/project'),
    WechatUserModel = require('../../../viewmodels/wechatuser');
var thunkify = require('thunkify-wrap');
var baserender = require('../../../lib/middlewares/baserender'),
    mongoose = require('mongoose'),
    koaMongoosePagination = require('koa-mongoose-pagination'),
    Schema = mongoose.Schema,
    co = require('co'),

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

    // var result2=yield thunkify(ProjectModel.populatedata, ProjectModel)(result.data);
    yield baserender(this, "member/project/index", {
        title: '我的项目',
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}

exports.detail = function*() {
    let info = this.params;

    var result = yield thunkify(ProjectModel.findByidAndUserID, ProjectModel)(info.id, this.session.wechatUserInfo._id);


    var projectinfo=yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);


    console.log(projectinfo);
    if (result && result.participants[0].status == -1) {

        yield baserender(this, "member/project/approve", {
            title: '你的申请还未审批',
            message:'你的申请还未审批',
            projectinfo: projectinfo

        });
    }
    else if (result) {
        yield baserender(this, "member/project/detail", {
            title: '项目详情',

            projectinfo: projectinfo

        });
    }
    else {
        yield baserender(this, "member/project/apply", {
            title: '请先申请,等待审批',

            projectinfo: projectinfo

        });
    }

}

//提交申请
exports.doapply = function*() {
    
    var info = this.request.body;
    var result = yield thunkify(ProjectModel.findByidAndUserID, ProjectModel)(info.id, this.session.wechatUserInfo._id);
    if (result && result.participants[0].status == -1) {

        this.send(null, 0, "你的申请还未审批");
    }
    else if (result) {

        this.send(null, 0, "你的审批已经通过");

    }
    else {
        console.log('222222222222222222');

        result = yield thunkify(ProjectModel.updateParticipants, ProjectModel)(info.id,
            {
                _id: this.session.wechatUserInfo._id,
                'status': -1
            }
        );

        this.send(null, 0, "申请已经提交请等待审核");

    }

}