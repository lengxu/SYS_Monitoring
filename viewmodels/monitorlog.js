"use strict";

var mongoose = require('mongoose');

var MonitorlogSchema = require('../database/schemas/monitorlog');

module.exports = mongoose.model('Monitorlog',MonitorlogSchema);