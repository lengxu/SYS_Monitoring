///<reference path="../../typings/node/node.d.ts" />
"use strict";

var mongoose = require('mongoose');

var UserSchema = require('../database/schemas/user');

module.exports = mongoose.model('User',UserSchema);