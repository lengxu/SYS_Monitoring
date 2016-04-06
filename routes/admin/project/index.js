var ProjectModel = require('../../../viewmodels/project');
var thunkify = require('thunkify-wrap');
var adminbaserender = require('../../../lib/middlewares/adminbaserender');


//项目列表
exports.showindex = function*() {

    yield adminbaserender(this,"admin/project/index", {
        title: '项目列表'
    });
}
//添加项目
exports.showadd=function* () {
    yield adminbaserender(this,"admin/project/add", {
        title: '编辑项目'
    });
}
exports.doadd = function*() {
    console.log('ceshi');
    var  info= this.request.body;
    console.log(info);
    var project = new ProjectModel(info);

    yield thunkify(project.save,project);

    this.send(null, 0, "保存成功");

}
