"use strict";

var koa = require('koa'),
    Router = require('koa-router'),
// logger = require('koa-logger'),
    json = require('koa-json'),
    views = require('koa-views'),
//render = require('koa-ejs'),
    handlebars = require("koa-handlebars"),
    path = require('path'),
    onerror = require('koa-onerror'),
    session = require('koa-generic-session'),
    koaBunyanLogger = require('koa-bunyan-logger'),
    //paginate = require("koa-paginate"),
    //  paginateHelper = require('handlebars-helper-paginate'),
    paginateHelper = require('express-handlebars-paginate'),
    sessionStore = require('koa-session-mongoose');

var response = require('./lib/middlewares/response'),
    db = require('./database/dbHandel'),
    siteRoutes = require('./routes'),
    adminRoutes = require('./routes_sysadmin'),
    config = require('./config'),
    eventstrategy = require('./lib/eventstrategy/index'),
    wechatRoutes = require('./routes_wechat');

let app = koa();

let siteRouter = new Router();
let wechatRouter = new Router();
let adminRouter = new Router();


app.use(koaBunyanLogger({
    name: 'myapp',
    level: 'debug'
}));

app.use(function*(next) {
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
})
//
// // add middleware
// app.use(paginate.middleware({
//     // in case the limit is null
//     defaultLimit: config.paginate.defaultLimit,
//     // throws an error when exceeded
//     maxLimit: config.paginate.maxLimit
// }));

// render(app, {
//     root: path.join(__dirname, 'views'),
//     layout: 'template',
//     viewExt: 'html',
//     cache: false,
//     debug: true
// });

// handlebars templating
app.use(handlebars({
    extension: ['html', 'handlebars'],
    defaultLayout: "layout.html",
    viewsDir: 'views',
    partialsDir: 'views/partials',
    layoutsDir: "views/layouts",
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        static: function (name) {
            return require('./lib/static.js').map(name);
        },
        paginateHelper:paginateHelper.createPagination
    }
}));

app.keys = ['koa', 'nodedb'];

app.use(session({
    store: sessionStore.create(),
    collection: 'koaSessions',
    connection: db,
    expires: 30 * 60 * 1000,
    model: 'KoaSession'
}));


app.use(require('koa-bodyparser')())
    .use(json())
    // .use(logger())
    .use(require('koa-static')(__dirname + '/public'))
    .use(response())
    .use(siteRouter.routes())
    .use(siteRouter.allowedMethods())
    .use(adminRouter.routes())
    .use(adminRouter.allowedMethods())
    .use(wechatRouter.routes())
    .use(wechatRouter.allowedMethods())

siteRoutes(siteRouter);
adminRoutes(adminRouter);
wechatRoutes(wechatRouter);


app.on('error', function (err, ctx) {
    log.error('server error', err, ctx);
});

//事件机制
eventstrategy();

module.exports = app;
