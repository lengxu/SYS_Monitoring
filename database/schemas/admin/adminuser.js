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

    findByName: function (username, cb) {
        return this.findOne({username: username}, cb);
    }

};

module.exports = AdminUserSchema;


