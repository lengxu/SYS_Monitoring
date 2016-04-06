//登录
exports.index = function*() {
    this.session = null;
    this.redirect('/sysadmin/login');
}