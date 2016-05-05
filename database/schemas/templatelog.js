"use strict";

let mongoose = require('mongoose'),
    Schema=mongoose.Schema,
    koamongoosePagination = require('koa-mongoose-pagination');


/*
 *   name:项目名称
 *
 *
 *
 *
 */
let TemplatelogSchema = new mongoose.Schema({
    projectinfo:
    {
        _id:{type:String},
        name:{type:String},
        siteurl:{type:String},
    },
    wechatuserinfo: {
        openid:{type:String},
        nickname:{type:String},
        name: {type: String}
    },
    templateId: {type: String},
    addtime:{type:Date},
    sendresult:{type:String},
    monitorloginfoId:{type:String}
});

TemplatelogSchema.statics = {

};


TemplatelogSchema.plugin(koamongoosePagination);

module.exports = TemplatelogSchema;


