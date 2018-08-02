const Controller = require('egg').Controller;

class PersonCenterController extends Controller {
  // 获取内容列表，分页，每页几个
  async index() {
    const { ctx, service } = this;
    const response = { success: false, message: '操作失败' };
    const result = await service.personCenter.index('article', ctx.query);
    if (result) {
      response.message = '操作成功';
      response.success = true;
      response.data = result;
    }
    ctx.body = response;
    ctx.status = 200;
  }

  // 删除内容信息
  async destroy() {
    const { ctx, service } = this;
    const response = { success: false, message: '操作失败' };
    const { success } = await service.personCenter.destroy('article', ctx.request.body);
    if (success) {
      response.message = '操作成功';
      response.success = true;
    }
    this.body = response;
    this.status = 200;
  }
}

module.exports = PersonCenterController;
