"use strict";

var mongoose = require('mongoose');

var TemplatelogSchema = require('../database/schemas/templatelog');

module.exports = mongoose.model('Templatelog',TemplatelogSchema);