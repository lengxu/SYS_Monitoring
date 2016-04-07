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

ProjectSchema.plugin(koamongoosePagination);

module.exports = ProjectSchema;


