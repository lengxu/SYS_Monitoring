///<reference path="../../typings/node/node.d.ts" />
"use strict";

var mongoose = require('mongoose');

var ProjectSchema = require('../database/schemas/project');

module.exports = mongoose.model('Project',ProjectSchema);