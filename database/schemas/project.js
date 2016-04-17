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
let ProjectSchema = new mongoose.Schema({
    name: {type: String},
    department: {type: String},
    siteurl: {type: String},
    status: {type: Number, default: -1},
    starttime: {type: Date},
    lastmonitortime: {type: Date},
    lastmonitorstatus: {type: Number},
    //参与人员列表
    // participants: [String]
    participants: [{
        // _wechatuserobjectid: {type: Schema.Types.ObjectId, ref: 'WechatUser'},
        // _wechatuserobjectid: {type:String},
        _id:{type: Schema.Types.ObjectId, ref: 'WechatUser'},
        status: {type: Number, default: -1}
    }]
});

ProjectSchema.statics = {

    findByName: function (name, cb) {
        return this.findOne({name: name}, cb);
    },

    findByid: function (id, cb) {
        var result= this.findOne({_id: id})

            return result.populate('participants._id').exec(cb);
    },

    findByidAndUserID: function (id,userid, cb) {
        var result= this.findOne({"_id": id,"participants._id":userid})

        return result.populate('participants._id').exec(cb);
    },

    updateParticipants: function (id,participants, cb) {
        return this.update({_id: id,}, {$addToSet: {participants: participants}}, cb);
    },
    //更新项目成员状态
    updateParticipantStatus: function (id,wechatuserid,status, cb) {

            console.log(status);
        return this.update({_id: id,"participants._id":wechatuserid},{$set: {"participants.0.status": status}}, cb);
    },
    populatedata:function (data,cb) {

        console.log(data);
        return data[0].populate(('participants._id'),cb);
    }

};

ProjectSchema.methods.GetStatus = function () {
    if (this.status == 0) {

        return '已启用';
    }
    else if (this.status == -1) {

        return '未启用';
    }
    else {
        return '未知状态';
    }
};


ProjectSchema.methods.GetMonitortingStatus = function () {

    if (this.lastmonitorstatus == 0) {

        return '正常';
    }
    else if (this.lastmonitorstatus == -1) {

        return '出错';
    }
    else {
        return '未知状态';
    }
};


ProjectSchema.methods.GetParticipantStatus = function () {
    if (this.participants.status == 0) {

        return '已启用';
    }
    else if (this.participants.status  == -1) {

        return '未启用';
    }
    else {
        return '未知状态';
    }
};

ProjectSchema.plugin(koamongoosePagination);

module.exports = ProjectSchema;


