var UserModel = require('../viewmodels/user');
var $ = require('../lib/util/md5');
var baserender=require('../lib/middlewares/baserender');

var http = require('http');

//登录
exports.index = function *(){

    //get request
    var nodegrass = require('nodegrass');

    nodegrass.get("http://www.ompchinqa.com/asdfasd",function(data,status,headers){
        console.log(status);
        console.log(headers);
        console.log(data);
    },null,'utf8').on('error', function(e) {
        console.log("Got error: " + e.message);
    });

    // console.log('111111122222222');
    //
    //
    // var qs = require('querystring');
    //
    // var post_data = {
    //     a: 123,
    //     time: new Date().getTime()};//这是需要提交的数据
    //
    //
    // var content = qs.stringify(post_data);
    //
    // var options = {
    //     hostname: 'www.ompchina.com',
    //     port: 80,
    //     path: '/',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    //     }
    // };
    //
    // var req = http.request(options, function (res) {
    //     console.log('STATUS: ' + res.statusCode);
    //     console.log('HEADERS: ' + JSON.stringify(res.headers));
    // });
    //
    // req.on('error', function (e) {
    //     console.log('problem with request: ' + e.message);
    // });
    //
    // console.log(req);
}
