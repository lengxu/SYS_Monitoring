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
    }],
    statistics: [{
        name: {type: Number},
        value: {type: Number, default: 1},
        _id: false
    }]

});

ProjectSchema.statics = {

    findByName: function (name, cb) {
        return this.findOne({name: name}, cb);
    },

    findByid: function (id, cb) {

        var result = this.findOne({_id: id}, cb);
        // result._castError;
        return result.populate('participants._id').exec(cb);
    },

    findByidAndUserID: function (id, userid, cb) {
        var result = this.findOne({"_id": id, "participants._id": userid})

        return result.populate('participants._id').exec(cb);
    },

    findByidAndMonitorstatus: function (id, status, cb) {
        return this.findOne({"_id": id, "statistics.status": monitorstatus},cb);

    },

    updateParticipants: function (id, participants, cb) {
        return this.update({_id: id}, {$addToSet: {participants: participants}}, cb);
    },

    //更新项目
    updateProjectinfo: function (Projectinfo, cb) {

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

        var result = this.find({status: 0, starttime: {$lte: new Date().toFormat("YYYY-MM-DD HH24:MI:SS")}}, cb);
        return result.populate('participants._id').exec(cb);
    },

    findProjectMonitorByIDAndStatus(id, monitorstatus, cb)
    {
        return   this.findOne({"_id": id, "statistics.name": monitorstatus},cb);
    },
    updateProjectMonitorInfo: function (id, monitorstatus,projectinfo, cb) {

        if (projectinfo && projectinfo._id) {
            this.update({_id: id}, {
                $set: {
                    lastmonitorstatus: monitorstatus,
                    lastmonitortime: new Date().toFormat("YYYY-MM-DD HH24:MI:SS")
                }
            }, cb);

            this.update({_id: id, 'statistics.name': monitorstatus}, {
                $inc: {
                    'statistics.$.value': 1
                }
            }, false, cb);
        }
        else
        {
            this.update({_id: id}, {
                $set: {
                    lastmonitorstatus: monitorstatus,
                    lastmonitortime: new Date().toFormat("YYYY-MM-DD HH24:MI:SS")
                }
                 ,
                $addToSet: {
                    'statistics': {'name':monitorstatus}
                }
            }, cb);
        }

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

    if (this.lastmonitorstatus == 200 ||this.lastmonitorstatus == 302  ) {

        return '正常';
    }
    else if (this.lastmonitorstatus == 404 || this.lastmonitorstatus == 500) {

        return '出错';
    }
    else if (!this.lastmonitorstatus) {

        return '未监测';
    }
    else {
        return '异常';
    }
};


ProjectSchema.methods.GetParticipantStatus = function () {

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
    return moment(this.starttime).format('YYYY-MM-DD');
};

ProjectSchema.methods.GetLastmonitortime = function () {
    if (this.lastmonitortime) {
        return moment(this.lastmonitortime).format('YYYY-MM-DD HH:MM:SS');
    } else {
        return '';
    }
};


ProjectSchema.plugin(koamongoosePagination);

module.exports = ProjectSchema;


