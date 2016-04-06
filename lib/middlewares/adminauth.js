"use strict";
var util = require('util');

/*
 * 校验会话
 */
exports.api = function() {
    return function*(next) {
        if (!this.session || !this.session.adminuser) {
            this.send(null, 999, "会话失效");
            return;
        }
        yield next;
    }
}

exports.view = function() {
    return function*(next) {
        if (!this.session || !this.session.adminuser) {
			this.redirect('/sysadmin/login?returnurl='+this.url);
           /* yield this.render("login", {
                title: 'login',
                "layout": "template"
            });*/
            return;
        }

        console.log(this.session);
        yield next;
    }
}
