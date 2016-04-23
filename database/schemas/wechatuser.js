"use strict";

let mongoose = require('mongoose');
let dt = require('date-utils'),
    koamongoosePagination = require('koa-mongoose-pagination');



var WechatUserSchema = new mongoose.Schema({
    openid: {type: String},
    nickname: {type: String},
    sex: {type: String},
    province: {type: String},
    country: {type: String},
    city: {type: String},
    headimgurl: {type: String},
    privilege: {type: [String]},
    unionid: {type: String},
    addtime: {type: Date, default: new Date().toFormat("YYYY-MM-DD HH24:MI:SS")},
    updatetime: {type: Date},
    addip: {type: String},
    userinfo: {
        name:{type:String},
        department:{type:String},
        tel: {type: String},
        ext: {type: String},
        email: {type: String},
        updatetime: {type: Date}
    }
});

WechatUserSchema.statics = {

    findByOpenID: function (openid, cb) {
        return this.findOne({openid: openid}, cb);
    },
    findByID: function (id, cb) {
        return this.findOne({_id: id}, cb);
    },
    updateUserInfoByOpenID: function (openid, userinfo, cb) {
        return this.update({openid: openid}, {$set: {userinfo: userinfo}}, cb);
    }
};


WechatUserSchema.plugin(koamongoosePagination);

module.exports = WechatUserSchema;
