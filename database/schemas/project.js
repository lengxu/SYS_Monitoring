"use strict";

let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    moment = require('moment'),
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
        _id: {type: Schema.Types.ObjectId, ref: 'WechatUser'},
        status: {type: Number, default: -1}
    }]
});

ProjectSchema.statics = {

    findByName: function (name, cb) {
        return this.findOne({name: name}, cb);
    },

    findByid: function (id, cb) {

        var result = this.findOne({_id: id}, cb);
        return result.populate('participants._id').exec(cb);
    },

    findByidAndUserID: function (id, userid, cb) {
        var result = this.findOne({"_id": id, "participants._id": userid})

        return result.populate('participants._id').exec(cb);
    },

    updateParticipants: function (id, participants, cb) {
        return this.update({_id: id}, {$addToSet: {participants: participants}}, cb);
    },

    //更新项目
    updateProjectinfo: function (Projectinfo, cb) {

        console.log(Projectinfo.name);
        return this.update({_id: Projectinfo._id},
            {
                $set: {
                    name: Projectinfo.name,
                    department: Projectinfo.department,
                    siteurl: Projectinfo.siteurl,
                    status: Projectinfo.status,
                    starttime: Projectinfo.starttime
                }
            }, cb);
    },

    //更新项目成员状态
    updateParticipantStatus: function (id, wechatuserid, status, cb) {

        console.log(status);
        return this.update({_id: id, "participants._id": wechatuserid}, {$set: {"participants.$.status": status}}, cb);
    },
    populatedata: function (data, cb) {

        console.log(data);
        return data[0].populate(('participants._id'), cb);
    },

    //获取监测项目
    findMonitorProject: function (monitortime, cb) {

        var result = this.find({status: 0}, cb);

        return result.populate('participants._id').exec(cb);
    },

    updateProjectMonitorInfo: function (id, monitorstatus, cb) {
        return this.update({_id: id}, {
            $set: {
                lastmonitorstatus: monitorstatus,
                lastmonitortime: new Date().toFormat("YYYY-MM-DD HH24:MI:SS")
            }
        }, cb);
    }


};

ProjectSchema.methods.GetStatus = function () {

    console.log('333333335555');

    return ;

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

    console.log('3333444');

    if (this.lastmonitorstatus == 200) {

        return '正常';
    }
    else if (this.lastmonitorstatus == 404||this.lastmonitorstatus == 500) {

        return '出错';
    }
    else if (!this.lastmonitorstatus) {

        return '未监测';
    }
    else {
        return '未知状态';
    }
};


ProjectSchema.methods.GetParticipantStatus= function () {

    console.log('11111112244444');
    if (this.participants.status == 0) {

        return '已启用';
    }
    else if (this.participants.status == -1) {

        return '未启用';
    }
    else {
        return '未知状态';
    }
};


ProjectSchema.methods.GetStarttime = function () {
    return moment(this.starttime).format('YYYY-MM-DD HH:MM:SS');
};

ProjectSchema.methods.GetLastmonitortime = function () {
    return moment(this.lastmonitortime).format('YYYY-MM-DD HH:MM:SS');
};


ProjectSchema.plugin(koamongoosePagination);

module.exports = ProjectSchema;


