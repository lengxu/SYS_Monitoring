var UserModel = require('../viewmodels/user');
var $ = require('../lib/util/md5');
var baserender=require('../lib/middlewares/baserender');

var http = require('http');

    //登录
exports.index = function *(){

    console.log('111111122222222');


    var qs = require('querystring');

    var post_data = {
        a: 123,
        time: new Date().getTime()};//这是需要提交的数据


    var content = qs.stringify(post_data);

    var options = {
        hostname: 'www.ompchina.com',
        port: 80,
        path: '/',
        method: 'GET',
        headers: {
        }
    };

    console.log('111111122222222');

    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
    });

    console.log(req);
}
