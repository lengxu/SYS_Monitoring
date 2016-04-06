"use strict";

let mongoose = require('mongoose');
let config = require('../config');

var db = mongoose.connect("mongodb://" + config.mongodb.host + ":" + config.mongodb.port + "/" + config.mongodb.name);

module.exports = db;