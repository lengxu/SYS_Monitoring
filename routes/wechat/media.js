"use strict";
let config = require('../../config'),
    baserender = require('../../lib/middlewares/baserender'),
    WechatAPI = require('../../lib/Wechat/wechatapi'),
    fs = require('co-fs'),
    uploadhelper = require('../../lib/util/uploadhelper');

var ffmpeg = require('ffmpeg');

//登录
exports.index = function*() {
    console.log('1');
    yield baserender(this, "wechat/media", {
        title: '上传多媒体文件'
    });
}


//登录
exports.getMedia = function*() {

    var info = this.request.body;

    var databuffer = yield * WechatAPI.getMedia(info.mediaId);

    // var body = Buffer.concat(databuffer);
    var mediainfo = yield uploadhelper.savebuffer(databuffer, { extname: info.mediatype });

    // var img = new Buffer(WechatAPI.getMedia(info.mediaId), 'base64').toString('binary');

    try {

        var process = new ffmpeg(mediainfo.filePath);

        process.then(function(video) {
            console.log('6');

            // Callback mode
            video.fnExtractSoundToMP3(mediainfo.upload_path + mediainfo.filename + '.mp3', function(error, file) {

                if (!error) {
                    // console.log('Audio file: ' + mediainfo.upload_path + mediainfo.filename);
                }
            });
        }, function(err) {
            console.log('Error: ' + err);
        });
    } catch (e) {
        console.log('3');

        console.log(e.code);
        console.log(e.msg);
    }

    this.send({ file: mediainfo.base_url + mediainfo.filename + '.mp3' }, 0, "上传成功");
}
