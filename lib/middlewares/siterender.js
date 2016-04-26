"use strict";

let config = require('../../config');

var thunkify = require('thunkify-wrap');

module.exports = function*(ctx, path, opts) {

    opts = opts || {};

    if (!opts.layout) {

        opts.layout = 'sitelayout';

    }
    yield ctx.render(path, opts);
}