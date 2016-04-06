"use strict";

let eventinfo = require('../../config').event;

module.exports = function() {

    if (eventinfo.enable) {
        console.log('事件启动');

        if (eventinfo.eventlist.monitoringinfo.enable) {
            console.log('网站监测事件启动');

            var monitoring = require('./monitoring');

            monitoring();
        }
    }
}
