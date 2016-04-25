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
let MonitorlogSchema = new mongoose.Schema({
    projectinfo:
    {
        _id:{type:String},
        name:{type:String},
        siteurl:{type:String},
    },
    lastmonitortime: {type: Date},
    lastmonitorstatus: {type: Number},
    responsetime:{type:Number},
    responsemessage:{type:String},
    responsestatus:{type:Schema.Types.Mixed}
});

MonitorlogSchema.statics = {

    findByProjectId: function (projectid, cb) {
        return this.findOne({'projectinfo._id': projectid}, cb);
    }

};

MonitorlogSchema.methods.GetResponseStatus = function () {
    return this.responsestatus;
};


MonitorlogSchema.plugin(koamongoosePagination);

module.exports = MonitorlogSchema;


