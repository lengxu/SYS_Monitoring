"use strict";
var util = require('util');

/*
 * 定制报文格式
 */
module.exports = function () {
	return function* (next) {
		this.send = function (res, code, msg) {
			var result = {
				retCode: code
			}
			if (res) {
				result = util._extend(result, { data: res });
			}
			if (code !== 0 && msg) {
				result = util._extend(result, {
					retMsg: msg
				});
			}
			this.body = result;

    console.log(result);

		};

		yield next;
	}
}