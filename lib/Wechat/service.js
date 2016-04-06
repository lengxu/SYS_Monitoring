var OAuth = require('wechat-platform').OAuth;
var ComponentToken = require('wechat-platform').ComponentToken;
 
var config = require('../../config.js');
var redisClient = require('../../lib/Redis/AliCloudDB.js');
 
var oAuth = OAuth(config.wechat);
 
/**
 * redis key
 */
const PLATFORM_TICKET_KEY = 'qianmi.wechat.platform.ticket';
const PLATFORM_TOKEN_KEY = 'qianmi.wechat.platform.token';
 
/**
 * 获取第三方平台token
 */
exports.getComponentToken = function *() {

  var tokenData = JSON.parse(yield redisClient.get(PLATFORM_TOKEN_KEY));
 
  console.log(tokenData);

  if(tokenData) {
    var componentToken = ComponentToken(tokenData);
    if (componentToken.isValid()) {
      this.body= componentToken.data.access_token;

      return;
    }
  }
 
  var ticket = yield redisClient.get(PLATFORM_TICKET_KEY);
  tokenData = yield oAuth.getComponentToken(ticket);
 
  var result = ComponentToken(tokenData);
  redisClient.set(PLATFORM_TOKEN_KEY, JSON.stringify(result.data));
 
  return result.data.access_token;
}

exports.test = function *() { // 到达此路径则渲染login文件，并传出title值供 login.html使用
    this.body='Success';

}


var Event = require('wechat-platform').Message;
 
exports.eventProxy = Event(config.wechat).proxy(function *(){
  var info = this.weixin;
 
  if(info.InfoType = 'component_verify_ticket') {
    //存入缓存 
    redisClient.set(PLATFORM_TICKET_KEY, info.ComponentVerifyTicket);
  }
 
  this.body = 'success';
})
