'use strict';

var ProjectModel = require('../../viewmodels/project');
var thunkify = require('thunkify-wrap');
var baserender = require('../../lib/middlewares/baserender'),
    config = require('../../config');


//项目列表
exports.detail = function*() {
    console.log(this.request.query);
    yield baserender(this, "project/detail", {
        title: '项目详情'
    });
}
