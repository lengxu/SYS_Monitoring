"use strict";

let mongoose = require('mongoose');

var AdminUserSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String},
    state: {type: String},
    lastloginip: {type: String},
    lastlogintime: {type: Date}
});

AdminUserSchema.statics = {
    findById: function (id, cb) {
        return this.findOne({_id: id}, cb);
    }

    ,findByName: function (username, cb) {
        return this.findOne({username: username}, cb);
    }

    ,changePassword: function (id, password, cb) {
        return this.update({_id: id}, {
            $set: {
                password: password
            }
        }, cb);
    }

};

module.exports = AdminUserSchema;


