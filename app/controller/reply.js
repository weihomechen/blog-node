const { subObj } = require('../utils');
const Controller = require('egg').Controller;

class ReplyController extends Controller {
  // 新增回复
  async save() {
    const { ctx, service } = this;
    let response = {
      success: false,
    };
    if (ctx.session.user.name === ctx.request.body.author) {
      const request = subObj(['content', 'author', 'to', 'comment_id'], ctx.request.body);
      response = await service.reply.save(request);
      if (response.success) {
        const type = 2;
        const msgRequest = subObj(['content', 'author', 'to', 'comment_id'], ctx.request.body);
        service.message.create('message', msgRequest, type);
      }
    } else {
      response.msg = '用户登录失效啦，请重新登录';
    }

    ctx.body = response;
    ctx.status = 200;
  }

  // 删除回复
  async remove() {
    const { ctx, service } = this;
    let response = { success: false };
    // 只能删除自己的回复
    if (ctx.session.user.name === ctx.request.body.operator) {
      response = await service.reply.remove(subObj(['id'], ctx.request.body));
    } else {
      response.msg = '只能删除自己的评论哦';
    }

    ctx.body = response;
    ctx.status = 200;
  }
}

module.exports = ReplyController;
