var AdminUserModel = require('../../../viewmodels/admin/adminuser');
var $ = require('../../../lib/util/md5');
var adminbaserender = require('../../../lib/middlewares/adminbaserender'),
 thunkify = require('thunkify-wrap');



//登录
exports.index = function *() {
    yield adminbaserender(this,"admin/home/index", {
        title: '后台首页',
        menuinfo:{index:"active"}
    });
}


//修改密码
exports.changepassword = function *() {
    yield adminbaserender(this,"admin/home/changepassword", {
        title: '修改密码',
        menuinfo:{index:"active"}
    });
}



//修改密码
exports.dochangepassword = function *() {
    var info = this.request.body;

    if (!info.oldpassword)
    {
        this.send(null, -1, "旧密码不能为空");

        return;
    }

    if (info.newpassword!=info.confirmpassword)
    {
        this.send(null, -2, "新密码、确认密码不一致");

        return;
    }


    var result = yield thunkify(AdminUserModel.findById, AdminUserModel)(this.session.adminuser._id);

    if (result.password!=$.getMd5(info.oldpassword))
    {
        this.send(null, -1, "旧密码不正确");

        return;
    }

     result = yield thunkify(AdminUserModel.changePassword, AdminUserModel)(this.session.adminuser._id,$.getMd5(info.newpassword));

    this.send(null, 0, "修改成功");
}
