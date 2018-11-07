const crypto = require('crypto');
const generatePassword = require('password-generator');
const { Controller } = require('egg');
const sendToWormhole = require('stream-wormhole');
const {
  subObj,
  getFileName,
  passwordSecret,
} = require('../utils');

class UserController extends Controller {
  async login() {
    const { ctx, service } = this;
    const response = {
      success: false,
      msg: '',
      code: '',
      data: null,
    };
    let result = {};
    const { name, password: unEncrypted } = ctx.request.body;

    const password = crypto
      .createHmac('sha256', passwordSecret)
      .update(unEncrypted)
      .digest('hex');
    if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(name)) {
      result = await service.user.login('user', { email: name, password });
      if (!result.success) {
        result = await service.user.login('user', { name, password });
      }
    } else {
      result = await service.user.login('user', { name, password });
    }

    const {
      user,
      success,
    } = result;

    if (success) {
      response.success = true;
      response.msg = '登录成功';
      response.data = { user };
      ctx.session.user = user;
    } else {
      response.success = false;
      response.msg = '用户不存在或密码错误';
      response.data = null;
      response.code = 'login failed';
    }

    ctx.body = response;
    ctx.status = 200;
  }

  async connect() {
    const {
      ctx,
    } = this;

    this.app.redis.set(ctx.session.user.uid, ctx.request.body.socketId);

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: null,
    };
    ctx.status = 200;
  }

  logout() {
    const { ctx } = this;
    ctx.session = null;
    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: null,
    };
    ctx.status = 200;
  }

  info() {
    this.ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: this.ctx.session.user,
    };
    this.ctx.status = 200;
  }

  // 获取用户列表
  async list() {
    const { ctx, service } = this;
    const data = await service.user.list();

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data,
    };
    ctx.status = 200;
  }

  // 获取活跃用户列表
  async active() {
    const { ctx, service } = this;
    const data = await service.user.active();

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data,
    };
    ctx.status = 200;
  }

  async register() {
    const { ctx, service } = this;
    /*
    const result = await service.user.sendMail('register', ctx.request.body);

    debug(result);
    */

    const { password: unEncrypted } = ctx.request.body;

    const password = crypto
      .createHmac('sha256', passwordSecret)
      .update(unEncrypted)
      .digest('hex');
    ctx.request.body.password = password;
    const result = await service.user.register('user', ctx.request.body);

    ctx.body = result;
    ctx.status = 200;
  }

  async agree() {
    const { ctx, service } = this;
    // 必须是管理员才能操作
    if (ctx.session.user.role) {
      // 创建用户
      const { body } = ctx.request;
      const password = generatePassword(16, false);
      const userInfo = {
        name: body.nickname,
        password,
        email: body.email,
        role: 0,
      };

      await service.user.create('user', userInfo);
      // 发送通知邮件
      const result = await service.user.sendMail('agree', userInfo);

      ctx.body = result;
      ctx.status = 200;
    } else {
      ctx.body = {
        success: false,
        msg: '没有权限',
        code: 'permission denied',
        data: null,
      };
      ctx.status = 200;
    }
  }

  async reject() {
    const { ctx, service } = this;
    // 必须是管理员才能操作
    if (ctx.session.user.role) {
      // 发送通知邮件
      const result = await service.user.sendMail('reject', ctx.request.body);

      ctx.body = result;
      ctx.status = 200;
    } else {
      ctx.body = {
        success: false,
        msg: '没有权限',
        code: 'permission denied',
        data: null,
      };
      ctx.status = 200;
    }
  }

  async update() {
    const { ctx, service } = this;

    const response = {
      success: false,
      msg: '',
      code: '',
      data: null,
    };

    let params = subObj(['uid', 'name', 'oldPassword', 'password', 'email', 'motto'], ctx.request.body);

    const { password: unEncrypted, oldPassword: unEncryptedOld } = params;

    const password = unEncrypted && crypto
      .createHmac('sha256', passwordSecret)
      .update(unEncrypted)
      .digest('hex');

    const oldPassword = unEncryptedOld && crypto
      .createHmac('sha256', passwordSecret)
      .update(unEncryptedOld)
      .digest('hex');

    if (password) {
      params = {
        ...params,
        password,
        oldPassword,
      };
    }

    const { success, user, errorMsg } = await service.user.update('user', params);

    if (success) {
      response.success = true;
      response.msg = '修改成功';
      ctx.session.user = user;
    } else {
      response.success = false;
      response.msg = errorMsg || '修改失败，请稍后再试';
    }

    ctx.body = response;
    ctx.status = 200;
  }

  async upload() {
    const { ctx, service } = this;
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
      const { uid, type } = stream.fields;
      const { url } = result;
      const typeMap = ['avatar', 'cover', 'moneyCode'];
      const params = {
        uid,
        [typeMap[type]]: url,
      };
      const { success, user } = await service.user.update('user', params);
      if (success) {
        ctx.session.user = user;
        ctx.body = {
          success: true,
          msg: '上传成功',
          code: 'upload success',
          data: user,
        };
      } else {
        ctx.body = failRes;
      }
    } else {
      ctx.body = failRes;
    }
  }

  async join() {
    const { ctx, service } = this;

    const team = await service.team.detail('team', {
      tid: ctx.request.body.tid,
    });

    await service.message.create('message', {
      type: 1,
      title: '申请加入团队',
      content: `${ctx.session.user.name}申请加入您的团队, 请前往 个人中心-审批管理 进行处理～`,
      sender: ctx.session.user.uid,
      receiver: team.owner,
    });

    await service.approval.create('approval', {
      title: '申请加入团队',
      applicant: ctx.session.user.uid,
      approver: team.owner,
    });

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: null,
    };
    ctx.status = 200;
  }

  async exitTeam() {
    const { ctx, service, app } = this;
    const { uid = ctx.session.user.uid, tid } = ctx.request.body;

    // 修改申请人的信息
    const { success } = await service.user.update('user', { uid, tid: null });

    if (success) {
      const { owner } = await app.mysql.get('team', { tid });

      await service.message.create('message', {
        type: 1,
        title: '团队成员变更',
        content: `${ctx.session.user.name}已退出您的团队`,
        sender: ctx.session.user.uid,
        receiver: owner,
      });
    }

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: null,
    };
    ctx.status = 200;
  }

  async kicked() {
    const { ctx, service, app } = this;
    const { uid, tid } = ctx.request.body;

    // 修改用户的信息
    const { success } = await service.user.update('user', { uid, tid: null });

    if (success) {
      const { name } = await app.mysql.get('team', { tid });

      await service.message.create('message', {
        type: 1,
        title: '团队变更',
        content: `您已被请出${name}`,
        sender: ctx.session.user.uid,
        receiver: uid,
      });
    }

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: null,
    };
    ctx.status = 200;
  }

  async invite() {
    const { ctx, service } = this;
    const { tid, uid } = ctx.request.body;

    const team = await service.team.detail('team', { tid });
    const title = `${ctx.session.user.name}邀请您加入${team.name}`;

    await service.approval.create('approval', {
      type: 2,
      title,
      applicant: team.owner,
      approver: uid,
    });

    await service.message.create('message', {
      type: 1,
      title,
      content: `${ctx.session.user.name}邀请您加入他的团队, 请前往 个人中心-审批管理 进行处理～`,
      sender: team.owner,
      receiver: uid,
    });

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data: null,
    };
    ctx.status = 200;
  }
}

module.exports = UserController;
