'use strict';

var ProjectModel = require('../../viewmodels/project');
var thunkify = require('thunkify-wrap');
var baserender = require('../../lib/middlewares/baserender'),
    config = require('../../config');


//项目列表
exports.detail = function*() {
    let info = this.params;

    var result = yield thunkify(ProjectModel.findByid, ProjectModel)(info.id);

    yield baserender(this, "project/detail", {
        title: '项目详情',

        info:result

    });
}
