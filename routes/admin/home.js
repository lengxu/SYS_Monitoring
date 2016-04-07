var AdminUserModel = require('../../viewmodels/admin/adminuser');
var $ = require('../../lib/util/md5');
var adminbaserender = require('../../lib/middlewares/adminbaserender');


//登录
exports.index = function *() {
    yield adminbaserender(this,"admin/index", {
        title: '后台首页'
    });
}
