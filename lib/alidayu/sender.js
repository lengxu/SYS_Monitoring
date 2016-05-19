TopClient = require( './topClient' ).TopClient;
var client = new TopClient({
    'appkey':'23368085' ,
    'appsecret':'79e669c67b7545bf9d7c75d57b355430' ,
    'REST_URL' : 'http://gw.api.taobao.com/router/rest'
});

exports.sendsinglecall = function *(username,projectname,usertel) {
    client.execute( 'alibaba.aliqin.fc.tts.num.singlecall' , {
        'extend' , "'12345'" ,
        'tts_param' , "{username:"+username+",projectname:"+projectname+"}" ,
        'called_num' , usertel ,
        'called_show_num' , "4001008052" ,
        'tts_code' , 'TTS_9720145'
    }, function(error, response) {
        if (!error) console.log(response);
        else console.log(error);
    })
}
