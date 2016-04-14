var UserModel = require('../../viewmodels/admin/adminuser');
var $ = require('../../lib/util/md5');
var iphelper = require('../../lib/util/iphelper.js');
var adminbaserender = require('../../lib/middlewares/adminbaserender');

exports.index = function*() {


    yield adminbaserender(this, "admin/index", {
        // title: JSON.stringify(this.request)
        title:'ffff'
    });
}
