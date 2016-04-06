var UserModel = require('../viewmodels/user');
var $ = require('../lib/util/md5');
var baserender=require('../lib/middlewares/baserender');


    //登录
exports.index = function *(){
     yield baserender(this,"home", {
        title: 'home',
        user:this.session.user
    });
}
