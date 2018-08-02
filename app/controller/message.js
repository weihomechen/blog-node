const debug = require('debug')('message controller');
const Controller = require('egg').Controller;

class MessageController extends Controller {
  async list() {
    const { ctx, service } = this;
    const { type, pageNo } = ctx.query;
    const data = await service.message.list('message', {
      type,
      pageNo,
      uid: ctx.session.user.uid,
    });

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data,
    };
    ctx.status = 200;
  }

  async getUnReadTotal() {
    const { ctx, service } = this;
    const data = await service.message.getUnReadTotal('message', {
      uid: ctx.session.user.uid,
    });

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data,
    };
    ctx.status = 200;
  }

  async update() {
    const { ctx, service } = this;
    const { success } = await service.message.update(ctx.request.body);
    ctx.body = {
      success,
      msg: success || '更新消息失败，请稍后再试',
    };
    ctx.status = 200;
  }

  async create() {
    const { ctx, service } = this;
    const {
      receiver,
      ...otherParams
    } = ctx.request.body;
    const receiverArr = receiver ? receiver.split(',') : [];
    const sender = ctx.session.user.uid;
    const success = await Promise.all(receiverArr.map(async (item) => {
      const msgRequest = {
        ...otherParams,
        sender,
        receiver: item,
      };
      await service.message.create('message', msgRequest);
    }));
    ctx.body = {
      success,
      msg: success || '发送消息失败，请稍后再试',
    };
    ctx.status = 200;
  }
}

module.exports = MessageController;
