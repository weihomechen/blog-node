const debug = require('debug')('user service');
const path = require('path');
const nunjucks = require('nunjucks');

module.exports = app => {
  class User extends app.Service {
    async login(modal = 'user', params) {
      const user = await app.mysql.get(modal, params);
      const success = !!user;

      return { success, user };
    }

    async register(modal = 'user', params) {
      let user = await app.mysql.get(modal, {
        name: params.nickname,
      });

      if (user) {
        return {
          success: false,
          msg: '该花名已经被注册',
          code: 'name is duplicate',
          data: null,
        };
      }

      user = await app.mysql.get(modal, {
        email: params.email,
      });

      if (user) {
        return {
          success: false,
          msg: '该邮箱已经被注册',
          code: 'email is duplicate',
          data: null,
        };
      }

      const result = await this.app.mysql.insert(modal, {
        name: params.nickname,
        password: params.password,
        role: 0,
        email: params.email,
      });

      debug(result);

      return {
        success: true,
        msg: '',
        code: '',
        data: null,
      };
    }

    async update(modal = 'user', request) {
      let success = false;
      const { uid, oldPassword, ...updateFields } = request;
      let user = await app.mysql.get(modal, { uid });
      if (oldPassword && oldPassword !== user.password) {
        return { success, errorMsg: '请输入正确的旧密码' };
      }
      const { affectedRows } = await this.app.mysql.update(modal, request, {
        where: { uid },
        columns: Object.keys(updateFields).map(field => field),
      });
      success = affectedRows === 1;
      if (success) {
        user = await app.mysql.get(modal, { uid });
      }
      return { success, user };
    }

    async create(modal, request) {
      const result = await this.app.mysql.insert(modal, request);
      return result;
    }

    async sendMail(type, locals) {
      const {
        request,
      } = this.ctx;
      const { mailer } = app;
      const subject = ({
        register: '申请博客账号',
        agree: '博客账号申请通过通知',
        reject: '博客账号申请驳回通知',
      })[type];
      const admins = await app.mysql.select('user', {
        where: {
          role: 1,
        },
      });
      const toMail = admins.filter(v => !!v.email).map(v => v.email).join(',');
      debug(locals);
      debug(toMail);
      const html = nunjucks.render(path.join(app.config.view.root[0], `${type}.html`), {
        ...locals,
        server: `http://${request.header.host}`,
      });
      debug(html);
      const p = new Promise((resolve, reject) => {
        mailer.sendMail({
          from: app.config.robotEmail.from,
          to: type === 'register' ? toMail : locals.email, // gmail支持表单提交，qq企业邮箱表单提交有问题
          subject,
          html,
        }, (error, info) => {
          if (error) {
            debug(error);
            reject({
              success: false,
              data: null,
              msg: `${subject}邮件发送失败`,
              code: 'Send mail failure',
            });
          } else {
            debug(info);
            resolve({
              success: true,
              data: null,
              msg: '',
              code: '',
            });
          }
        });
      });

      const result = await p;

      return result;
    }

    async list(modal = 'user') {
      const record = await app.mysql.select(modal);
      return record;
    }

    async active() {
      const record = await app.mysql.query('select uid, count(*) as sum from article where status = 1 group by uid order by sum desc');
      return record;
    }
  }
  return User;
};
