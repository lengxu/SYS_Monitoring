var AdminUserModel = require('../../viewmodels/admin/adminuser');
var $ = require('../../lib/util/md5');
var thunkify = require('thunkify-wrap');
var iphelper = require('../../lib/util/iphelper');
var adminbaserender = require('../../lib/middlewares/adminbaserender');


//登录
exports.getlogin = function*() {

    yield this.render("admin/login", {
        title: 'admin Login',
        returnurl: this.query['returnurl'],
        layout: false
    });
}
//登录
exports.postlogin = function*() {


    var user = this.request.body;

    var result = yield thunkify(AdminUserModel.findByName, AdminUserModel)(user.username);

    if (!result) {
        this.send(null, 1, "用户不存在");

        return;
    }

    if (result.password !== $.getMd5(user.password)) {
        this.send(null, 1, "密码不正确");
        return;
    }

    //更新登录时间\ip
    result.lastloginip = iphelper.address(this);
    result.lastlogintime = new Date().toFormat("YYYY-MM-DD HH24:MI:SS");

    yield thunkify(result.update, result)(result);


    this.session.adminuser = result;
    this.send(null, 0, "登录成功");

    console.log("登录成功");

    /*this.send(null, 1, "用户不存在");
     console.log("登录成功");

     return;*/
}
