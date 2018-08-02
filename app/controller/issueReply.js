const { subObj } = require('../utils');
const { Controller } = require('egg');

class IssueReplyController extends Controller {
  // 新增回复
  async save() {
    const { ctx, service, app } = this;
    let response = {
      success: false,
    };
    if (ctx.session.user.uid === ctx.request.body.author) {
      const request = subObj(['content', 'author', 'issue_id'], ctx.request.body);
      response = await service.issueReply.save(request);
      // if (response.success) {
      //   const { author: to } = await app.mysql.get('issue', { id: request.issue_id });
      //   const type = 3;
      //   const msgRequest = {
      //     ...request,
      //     to,
      //     author: undefined,
      //   };
      //   service.message.create('message', msgRequest, type);
      // }
    } else {
      response.msg = '用户登录失效啦，请重新登录';
    }

    ctx.body = response;
    ctx.status = 200;
  }

  // 删除回复
  async remove() {
    const { ctx, service, app } = this;
    let response = { success: false };
    // 只能删除自己的回复
    const { id } = ctx.request.body;
    const { author } = await app.mysql.get('issue_reply', { id });
    if (author === ctx.request.body.operator) {
      response = await service.issueReply.save({ id, status: 0 });
    } else {
      response.msg = '只能删除自己的回复哦';
    }

    ctx.body = response;
    ctx.status = 200;
  }
}

module.exports = IssueReplyController;
