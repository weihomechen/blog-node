const debug = require('debug')('team controller');
const Controller = require('egg').Controller;
const {
  subObj,
  getFileName,
} = require('../utils');
const sendToWormhole = require('stream-wormhole');

class TeamController extends Controller {
  // 获取团队列表
  async list() {
    const { ctx, service } = this;
    const data = await service.team.list('team', subObj(['status'], ctx.query));

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data,
    };
    ctx.status = 200;
  }

  // 获取单个团队信息
  async detail() {
    const { ctx, service } = this;
    const { tid } = ctx.request.query;
    const data = await service.team.detail('team', { tid });

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data,
    };
    ctx.status = 200;
  }

  async create() {
    const { ctx, service } = this;
    const { name, uid } = ctx.session.user;
    const { name: teamName } = ctx.request.body;
    const team = await service.team.create('team', {
      ...ctx.request.body,
      creater: uid,
      owner: uid,
    });

    // 生成给系统管理员的审批
    const { uid: adminUid } = await this.app.mysql.get('user', { role: 1 });
    const approval = await service.approval.create('approval', {
      title: `${name}申请创建团队${teamName}`,
      type: 0,
      applicant: uid,
      approver: adminUid,
    });

    if (approval) {
      await service.message.create('message', {
        type: 1,
        title: `${name}申请创建团队${teamName}`,
        content: '需要您批准，请及时到 我的主页-审批管理 进行处理～',
        sender: uid,
        receiver: adminUid,
      });
    }

    debug(team.insertId);

    const { user } = await service.user.update('user', {
      uid: ctx.session.user.uid,
      tid: team.insertId,
    });

    ctx.session.user = user;

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: null,
    };
    ctx.status = 200;
  }

  async update() {
    const { ctx, service, app } = this;

    const response = {
      success: false,
      msg: '',
      code: '',
      data: null,
    };

    const params = subObj(['tid', 'owner', 'name', 'avatar', 'abstract'], ctx.request.body);

    if (!params.tid) {
      response.msg = '参数团队ID缺失';
      return;
    }

    const { owner, name } = await app.mysql.get('team', { tid: params.tid });

    if (ctx.session.user.uid !== owner) {
      response.msg = '需要团队管理员权限';
      return;
    }

    const result = await service.team.update('team', params);

    if (result) {
      response.success = true;
      response.msg = '修改成功';
      if (params.owner) { // 如果是转让团队
        const { uid: adminUid } = await this.app.mysql.get('user', { role: 1 });
        await service.message.create('message', {
          type: 1,
          title: `您已成为 ${name} 新的管理员`,
          content: '已解锁团队管理权限~',
          sender: adminUid,
          receiver: params.owner,
        });
      }
    } else {
      response.success = false;
      response.msg = '修改失败，请稍后再试';
    }

    ctx.body = response;
    ctx.status = 200;
  }

  async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const name = getFileName(stream.filename);
    let result;
    const failRes = {
      success: false,
      msg: '上传失败',
      code: 'upload failed',
      data: null,
    };

    try {
      result = await ctx.oss.put(name, stream);
    } catch (err) {
      await sendToWormhole(stream);

      throw err;
    }

    if (result) {
      ctx.body = {
        success: true,
        msg: '上传成功',
        code: 'upload success',
        data: result.url,
      };
    } else {
      ctx.body = failRes;
    }
  }
}

module.exports = TeamController;
