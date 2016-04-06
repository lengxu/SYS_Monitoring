///<reference path="../../typings/node/node.d.ts" />
"use strict";

var mongoose = require('mongoose');

var AdminUserSchema = require('../../database/schemas/admin/adminuser');

module.exports = mongoose.model('AdminUser',AdminUserSchema);