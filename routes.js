"use strict";

var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var home = require('./routes/home');
var auth = require('./lib/middlewares/auth');


/*var logout = require('./routes/logout');

var open = require('./routes/open');*/


module.exports = function(router) {

	router.get('/', index.index);
	router.get('/index', index.index);

    //用户登录
	router.get('/login', login.getlogin);
	router.post('/login', login.postlogin);

	//用户注册
	router.get('/register', register.getregister);
	router.post('/register', register.register);

	//home
	router.get('/home', auth.view(), home.index);


}
