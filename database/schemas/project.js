"use strict";

let mongoose = require('mongoose'),
    koamongoosePagination = require('koa-mongoose-pagination');


/*
 *   name:项目名称
 *
 *
 *
 *
 */

let ProjectSchema = new mongoose.Schema({
    name: {type: String},
    department: {type: String},
    siteurl: {type: String},
    status: {type: Number, default: -1},
    starttime: {type: Date},
    lastmonitortime: {type: Date},
    lastmonitorstatus: {type: Number}
});

ProjectSchema.statics = {

    findByName: function (name, cb) {
        return this.findOne({name: name}, cb);
    }

};

ProjectSchema.methods.GetStatus = function () {
    
    if (this.status==0)
    {

        return '已启用';
    }
    else if(this.status==-1)
    {

        return '未启用';
    }
    else{
        return '未知状态';
    }
};


ProjectSchema.methods.GetMonitortingStatus = function () {

    if (this.lastmonitorstatus==0)
    {

        return '正常';
    }
    else if(this.lastmonitorstatus==-1)
    {

        return '出错';
    }
    else{
        return '未知状态';
    }
};

// Schema.method('GetStatus', function () {
//     return 'sdfdf'
// });


ProjectSchema.plugin(koamongoosePagination);

module.exports = ProjectSchema;


