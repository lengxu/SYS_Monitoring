'use strict';

var thunkify = require('thunkify-wrap');
var baserender = require('../../../lib/middlewares/baserender'),
    mongoose = require('mongoose'),
    koaMongoosePagination = require('koa-mongoose-pagination'),
    Schema = mongoose.Schema,
    co = require('co'),

    config = require('../../../config');

//个人信息页面
exports.index = function*() {
    yield baserender(this, "member/wechat/index", {
        title: '关注二维码',
        menuinfo:{wechat:"active"}
    });
}