"use strict";

let config = require('../../config');

module.exports = function*(ctx, path, opts) {

    opts = opts || {};

    var adminuser = {
        username: ctx.session.adminuser.username
    };

    if (!opts.layout)
    {
        opts.layout='adminlayout';
    }
    opts.adminuser = adminuser;

    yield ctx.render(path, opts);
}