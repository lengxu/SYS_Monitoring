var config = {

    // debug 为 true 时，用于本地调试
    debug: true,

    // cdn host，如 http://cnodejs.qiniudn.com
    site_static_host: '', // 静态文件存储域名
    get mini_assets() {
        return !this.debug;
    }, // 是否启用静态文件的合并压缩，详见视图中的Loader
};
var path = require('path');


var path = require('path');
config.siteinfo = {
    domain: 'monitor.ompchina.net',
    host: 'http://monitor.ompchina.net'
};

//数据库信息
config.mongodb = {
    host: "127.0.0.1",
    port: "27017",
    name: "nodedb"
};

config.wechatinfo = {
    appid: 'wx1f984cba30eb34b7',
    appsecret: '9a5b9e4d9973bf25b4db84aedb803e01',
    redirectUrl: 'http://monitor.ompchina.net/wechat/callback',
    scope: 'snsapi_userinfo',
    jssdkdebug: false

};


config.wechatinfo.jssdk = {
    debug: false,
    jsApiList: ['checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onVoiceRecordEnd',
        'playVoice',
        'onVoicePlayEnd',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
    ]
}

/*config.wechat = {
    appid: 'wx07d339a3fa0d677c',
    appsecret: 'f7d67efbad4f6478bcd582b7af04ac95',
    msg_token: '31ce588c8b9b28df154585e1aba7a317',
    msg_aeskey: 'RpTvH8ynv45jYS0pI1YsvzeKjhuL4eP2hVha731rtT4'
};*/

config.redis = {
    host: '6fd7901b1dcc4fdb.m.cnsha.kvstore.aliyuncs.com',
    port: 6379,
    instanceid: '6fd7901b1dcc4fdb',
    password: 'Aliang520',
    options: {
        connect_timeout: 30000
    }
};


// 文件上传配置
config.upload = {
    path: path.join(__dirname, 'public/upload/'),
    url: '/upload/',
    file_limit: '1MB',
    extname: 'JPG'

}


//白名单IP
config.ip = {
    enable: false,
    whiteList: ['192.168.0.*', '8.8.8.[0-3]'],
    blackList: ['144.144.*']
}

config.paginate=
{
    resultsPerPage:10
}
 

//事件机制
config.event = {
    enable: true,
    eventlist: {
        monitoringinfo: {
            key: 'monitoring',
            name: '网站监测',
            minite: 1,
            second: 10,
            enable: true,
            monitortemplateid:'mH8OqxlrWDrUz8ypFxlcpmrfjvfyIPzcZskYDmqk68Y',
            approvetemplateid:'8ywKTfOQ1goSifXXtScM7o3OdcEVpDK5Zwrb3rfvu1c'
        }
    }
}


module.exports = config;
