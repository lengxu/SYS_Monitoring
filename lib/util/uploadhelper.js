/*var config = require('../../config');
var utility = require('utility');
var path = require('path');
var fs = require('co-fs');

exports.savebuffer = function(filebuffer, options) {
    return function*(next) {
        var filename = options.filename || utility.md5(String((new Date()).getTime()));

        var extname = options.extname || config.upload.extname;

        var upload_path = config.upload.path + extname + '/';
        var base_url = config.upload.url + extname + '/';
        var filePath = path.join(upload_path, filename + '.' + extname);
        var fileUrl = base_url + filename + '.' + extname;
        var hasdir = yield fs.exists(upload_path)

        if (!hasdir) {
            
            yield fs.mkdir(upload_path);
        }

        yield fs.writeFile(filePath, filebuffer, 'binary');
    };
};*/



var config = require('../../config');
var utility = require('utility');
var path = require('path');
var fs = require('co-fs');

exports.savebuffer = function(filebuffer, options) {
    return function*(next) {
        var filename = options.filename || utility.md5(String((new Date()).getTime()));

        var extname = options.extname || config.upload.extname;

        var upload_path = config.upload.path + extname + '\\';
        var base_url = config.upload.url + extname + '/';
        var filePath = path.join(upload_path, filename + '.' + extname);
        var fileUrl = base_url + filename + '.' + extname;
        var hasdir = yield fs.exists(upload_path);

        var mediainfo = {};

        mediainfo = {
            filePath: filePath,
            fileurl: fileUrl,
            filename: filename,
            extname: extname,
            base_url: base_url,
            upload_path: upload_path
        };

        console.log(mediainfo);


        if (!hasdir) {

            yield fs.mkdir(upload_path);
        }
        yield fs.writeFile(filePath, filebuffer, 'binary');

        return mediainfo;

    };
};