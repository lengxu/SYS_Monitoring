
var baserender = require('../lib/middlewares/baserender');

var iphelper = require('../lib/util/iphelper.js');



exports.index = function*() {


    yield baserender(this, "index", {
        // title: JSON.stringify(this.request)
        // title:iphelper.address(this)
        title:iphelper.address(this)

    });

    console.log(this);
}
