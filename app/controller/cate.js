const { subObj } = require('../utils');
const Controller = require('egg').Controller;

class CateController extends Controller {
  // 获取分类列表
  async list() {
    const { ctx, service } = this;
    const data = await service.cate.list('cate');

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data,
    };
    ctx.status = 200;
  }

  // 保存内容
  async save() {
    const { ctx, service } = this;
    let response = {
      success: false,
    };
    // 必须是管理员才能操作
    if (ctx.session.user.role) {
      const request = subObj(['id', 'color', 'name'], ctx.request.body);
      response = await service.cate.save('cate', request);
    } else {
      response.msg = '该操作要求管理员权限哦';
    }

    ctx.body = response;
    ctx.status = 200;
  }

  // 删除内容信息
  async remove() {
    const { ctx, service } = this;
    let response = { success: false };
    // 必须是管理员才能操作
    if (ctx.session.user.role) {
      response = await service.cate.remove('cate', subObj(['id'], ctx.request.body));
    } else {
      response.msg = '该操作要求管理员权限哦';
    }

    ctx.body = response;
    ctx.status = 200;
  }
}

module.exports = CateController;
