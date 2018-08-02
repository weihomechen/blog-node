const { subObj } = require('../utils');
const Controller = require('egg').Controller;

class CommentController extends Controller {
  // 新增评论
  async save() {
    const { ctx, service } = this;
    let response = {
      success: false,
    };
    const request = subObj(['content', 'author', 'article_id'], ctx.request.body);
    response = await service.comment.save(request);

    if (response.success) {
      const type = 2;
      const msgRequest = subObj(['content', 'author', 'article_id'], ctx.request.body);
      service.message.create('message', msgRequest, type);
    }

    ctx.body = response;
    ctx.status = 200;
  }

  // 删除评论
  async remove() {
    const { ctx, service } = this;
    let response = { success: false };
    // 评论者才能删除自己的评论
    if (ctx.session.user.name === ctx.request.body.operator) {
      response = await service.comment.remove(subObj(['id'], ctx.request.body));
    } else {
      response.msg = '只能删除自己的评论哦';
    }

    ctx.body = response;
    ctx.status = 200;
  }
}

module.exports = CommentController;
