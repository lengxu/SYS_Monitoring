var wrapper = require('co-redis');

var config = require('../../config.js');
var redis = require("redis"),
   client = redis.createClient(config.redis.port,config.redis.host, {
    detect_buffers: true,
    auth_pass: config.redis.password
});
   client.auth(config.redis.instanceid+':'+config.redis.password, redis.print);
var redisCo = wrapper(client);


module.exports = redisCo;
