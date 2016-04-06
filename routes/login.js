var UserModel = require('../viewmodels/user');
var $ = require('../lib/util/md5');
var thunkify = require('thunkify-wrap');
var baserender=require('../lib/middlewares/baserender');


//登录
exports.getlogin = function*() {

        yield baserender(this,"login", {
            title: '1User Login',
            returnurl:this.query['returnurl']
        });
    }
    //登录
exports.postlogin = function*() {


    var user = this.request.body;
    console.log(user);

    var result = yield thunkify(UserModel.findByName, UserModel)(user.email);
    console.log(result);

    if (!result) {
        console.log("用户不存在");

        this.send(null, 1, "用户不存在");
        return;
    }

    if (result.password !== $.getMd5(user.password)) {
        this.send(null, 1, "密码不正确");
        return;
    }

    this.session.user = user;
    this.send(null, 0, "登录成功");

    console.log("登录成功");

    /*this.send(null, 1, "用户不存在");
    console.log("登录成功");

    return;*/
}
