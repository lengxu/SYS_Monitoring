var UserModel = require('../../viewmodels/admin/adminuser');
var $ = require('../../lib/util/md5');
var iphelper = require('../../lib/util/iphelper.js');

exports.index = function*() {


    yield render(this, "admin/index", {
        // title: JSON.stringify(this.request)
        title:'ffff',
        layout: 'admin_layout'


    });
}
