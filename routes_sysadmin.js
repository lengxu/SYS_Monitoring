
"use strict";

var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var home = require('./routes/home');
var auth = require('./lib/middlewares/auth');


var adminindex = require('./routes/admin');
var adminlogin = require('./routes/admin/login');
var adminregister = require('./routes/admin/register');

var adminhome = require('./routes/admin/home/index');
var adminlogout = require('./routes/admin/logout');
var adminproject = require('./routes/admin/project/index');
var adminauth = require('./lib/middlewares/adminauth');


module.exports = function(router) {

    router.get('/sysadmin/', adminhome.index);

    //管理员登录
    router.get('/sysadmin/login', adminlogin.getlogin);
    router.post('/sysadmin/login', adminlogin.postlogin);

    //创建管理员
    router.get('/sysadmin/register', adminregister.getregister);
    router.post('/sysadmin/register', adminregister.postregister);

    //管理员退出登录
    router.get('/sysadmin/logout', adminlogout.index);

    //home
    router.get('/sysadmin/home/changepassword', adminauth.view(), adminhome.changepassword);
    router.post('/sysadmin/home/dochangepassword', adminauth.view(), adminhome.dochangepassword);
    router.get('/sysadmin/home/', adminauth.view(), adminhome.index);


    //项目管理
    router.get('/sysadmin/project/', adminauth.view(), adminproject.showindex);
    router.get('/sysadmin/project/index', adminauth.view(), adminproject.showindex);
    router.get('/sysadmin/project/add', adminauth.view(), adminproject.showadd);
    router.post('/sysadmin/project/doadd', adminauth.api(), adminproject.doadd);
    router.get('/sysadmin/project/:id?/edit', adminauth.view(), adminproject.showedit);
    router.post('/sysadmin/project/doedit', adminauth.api(), adminproject.doedit);
    router.get('/sysadmin/project/:id?/detail', adminauth.view(), adminproject.detail);
    router.post('/sysadmin/project/doapprove', adminauth.api(), adminproject.doapprove);




}
