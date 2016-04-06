var UserModel = require('../viewmodels/user');
var $ = require('../lib/util/md5');
var thunkify = require('thunkify-wrap');
var baserender = require('../lib/middlewares/baserender');


    //登录
exports.getregister = function *(){
    // yield this.render("register", {
    //     title: 'User register',
    //     "layout": "template"
    // });

    yield baserender(this,"register", {
        title: 'User register'
    });
}

//创建用户
exports.register = function * (){
    var info = this.request.body;

    console.log(info);

    
    var result = yield thunkify(UserModel.findByName,UserModel)(info.email);
    
    if (result) {
        return this.send(null,1,"用户已存在");
    }
    

    console.log(result);

    info.password = $.getMd5(info.password);

    console.log(info.password);
    
    
    var user = new UserModel(info);
    
    yield thunkify(user.save,user);

    this.session.user = user;

    this.send(null,0);
}