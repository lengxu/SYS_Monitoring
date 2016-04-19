
var baserender = require('../lib/middlewares/baserender');

var iphelper = require('../lib/util/iphelper.js'),

 request = require('koa-request');

var ping = require('ping');




exports.index = function*() {

    // var hosts = ['192.168.1.1', 'google.com', 'ompchina.net'];
    // hosts.forEach(function(host){
    //     ping.sys.probe(host, function(isAlive){
    //         var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
    //         console.log(msg);
    //     });
    // });
    //
    // this.body='dsfsf';
    var options = {
            url: 'http://www.ompchina.com/asdfsf',
        headers: { 'User-Agent': 'request' }
    };

    var response = yield request(options); //Yay, HTTP requests with no callbacks!

    console.log(response);
    // var info = JSON.parse(response.body);

    this.body ="111";
    // // yield baserender(this, "index", {
    //     // title: JSON.stringify(this.request)
    //     // title:iphelper.address(this)
    //     title:iphelper.address(this)
    //
    // });
    //
    // console.log(this);
}
