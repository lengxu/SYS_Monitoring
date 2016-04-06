var AdminUserModel = require('../../viewmodels/admin/adminuser');
var $ = require('../../lib/util/md5');
var thunkify = require('thunkify-wrap');
var adminbaserender = require('../../lib/middlewares/adminbaserender');


    //登录
exports.getregister = function *(){
    // yield this.render("register", {
    //     title: 'User register',
    //     "layout": "template"
    // });

    yield this.render("admin/register", {
        title: 'User register',
        layout:false
    });
}

//创建用户
exports.postregister = function * (){
    var info = this.request.body;

    console.log(info);

    console.log(info.password);

    console.log(info.email);



    var result = yield thunkify(AdminUserModel.findByName,AdminUserModel)(info.username);
    
    if (result) {
        return this.send(null,1,"用户已存在");
    }


    console.log(result);

    info.password = $.getMd5(info.password);

    console.log(info.password);
    

    var adminuser = new AdminUserModel(info);
    
    yield thunkify(adminuser.save,adminuser);

    this.session.adminuser = adminuser;

    this.send(null,0);
}