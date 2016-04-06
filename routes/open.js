var router = require('koa-router')(),

    service = require('../lib/wechat/service');



router.get('/test', service.test);

router.get('/getComponentToken', service.getComponentToken);

router.get('/notice', service.eventProxy);

router.post('/notice', service.eventProxy);


module.exports = router;
