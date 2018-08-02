// const debug = require('debug')('approval controller');
const { Controller } = require('egg');
const { approvalMsgTemp } = require('../extend/helper');

class ApprovalController extends Controller {
  async list() {
    const { ctx, service } = this;
    const data = await service.approval.list('approval', {
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

  // TODO:审批应该有个失效状态，比如同一个用户同时申请加入几个团队
  // 第一个同意的审批应该把其他互斥的、未同意的审批无效化
  // 不然就是最后一个同意的审批决定了用户加入哪个团队
  async update() {
    const { ctx, service } = this;
    const { aid, status } = ctx.request.body;
    const { success } = await service.approval.update(ctx.request.body);
    if (success) {
      // 取申请者和审批者的id
      const { applicant, approver, type } = await this.app.mysql.get('approval', { aid });
      // 取相关信息
      const { name, tid } = await this.app.mysql.get('user', { uid: approver });
      if (+type === 0) { // 创建团队
        const { tid: teamId } = await this.app.mysql.get('user', { uid: applicant });
        if (status === 1) { // 同意创建
          await service.team.update('team', { tid: teamId, status: 1 });
        } else {
          // 驳回创建
          await Promise.all([
            service.user.update('user', { uid: applicant, tid: null }),
            service.team.del('team', { tid: teamId }),
          ]);
        }
      } else if (+type === 1) { // 申请加入团队
        if (+status === 1) {
          // 更新申请者的信息
          await service.user.update('user', { uid: applicant, tid });
        }
      } else if (+type === 2) { // 邀请加入团队
        // 更新审批者的信息
        const { tid: applicantTid } = await this.app.mysql.get('user', { uid: applicant });
        await service.user.update('user', { uid: approver, tid: applicantTid });
      }
      await service.message.create('message', {
        type: 1,
        sender: 0,
        receiver: applicant,
        ...approvalMsgTemp(type, { status, name }),
      });
    }

    ctx.body = {
      success,
      msg: '',
      code: '',
    };
    ctx.status = 200;
  }
}

module.exports = ApprovalController;
