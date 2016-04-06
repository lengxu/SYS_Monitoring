"use strict";

var mongoose = require('mongoose');

var WechatUserSchema = require('../database/schemas/wechatuser');

module.exports = mongoose.model('WechatUser',WechatUserSchema);