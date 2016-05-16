'use strict';

var ProjectModel = require('../../../viewmodels/project'),
    MonitorlogModel=require('../../../viewmodels/monitorlog'),
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
        conditions: {participants:{'_id':this.session.wechatUserInfo._id,"status":0}},
        sortBy: {'_id': -1}, // Sort by _id DESC
        limit: resultsPerPage,
        offset: (currentPage * resultsPerPage) - resultsPerPage
    });
    yield baserender(this, "member/project/index", {
        title: '我的项目',
        menuinfo:{project:"active",project_first:"active"},
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}

//所有项目列表
exports.showallproject = function*() {
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
    yield baserender(this, "member/project/allproject", {
        title: '所有项目',
        menuinfo:{project:"active",project_second:"active"},
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}

exports.detail = function*() {
    let info = this.params;
    var result = yield thunkify(ProjectModel.findByidAndUserID, ProjectModel)(info.id, this.session.wechatUserInfo._id);


    var projectinfo=yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

    var projectmonitorlogs=yield thunkify(MonitorlogModel.findTopByProjectId,MonitorlogModel)(info.id,100);

    var charttimedata=[],
        chartvaluedata=[],
        maxchartvalue=100;
    yield projectmonitorlogs.map(function *(item) {

        if (!maxchartvalue || item.responsetime>(maxchartvalue+100) )
        {
            maxchartvalue=item.responsetime+100;
        }

        charttimedata.unshift("'"+item.lastmonitortime.toFormat('YYYY-MM-DD HH24:MI:SS')+"'");
        chartvaluedata.unshift(item.responsetime);
    });


    console.log(result);
    console.log(projectinfo);
    if (result && result.participants[0].status == -1) {

        yield baserender(this, "member/project/approve", {
            title: '你的申请还未审批',
            message:'你的申请还未审批',
            menuinfo:{project:"active",project_first:"active"},
            projectinfo: projectinfo

        });
    }
    else if (result) {
        yield baserender(this, "member/project/detail", {
            title: '项目详情',
            menuinfo:{project:"active",project_first:"active"},

            projectinfo: projectinfo,

            charttimedata:charttimedata,

            chartvaluedata:chartvaluedata,

            maxchartvalue:maxchartvalue,
            

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
    else {
        yield baserender(this, "member/project/apply", {
            title: '请先申请,等待审批',
            menuinfo:{project:"active",project_first:"active"},
            projectinfo: projectinfo

        });
    }

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
    yield baserender(this, "member/project/monitor", {
        title: '我的项目_监控日志',
        menuinfo:{project:"active",project_first:"active"},
        totalRows: result.count,
        items: result.data,
        pagination: {page: currentPage, limit: resultsPerPage, totalRows: result.count}
    });
}
// check route middleware
exports.pcCheck = function() {
    return function*(next) {
        var browser = require('beyond-lib/lib/browser');
        var browserinfo = browser.parse(this.request.header["user-agent"]);
        var requestinfo = this.params;

        //判断微信跳转
        if (!browserinfo.isMicroMessenger) {

            this.redirect('/project/' + requestinfo.id + "/detail");

            return;
        }
        yield next;
    }
};

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

        result = yield thunkify(ProjectModel.updateParticipants, ProjectModel)(info.id,
            {
                _id: this.session.wechatUserInfo._id,
                'status': -1
            }
        );

        this.send(null, 0, "申请已经提交请等待审核");

    }

}