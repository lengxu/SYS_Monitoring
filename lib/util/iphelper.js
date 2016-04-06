exports.address = function(ctx) {
    return '127.0.0.1';
    // return ctx.headers['x-forwarded-for'] ||
    //     ctx.connection.remoteAddress ||
    //     ctx.socket.remoteAddress ||
    //     ctx.connection.socket.remoteAddress||'127.0.0.1';
};
