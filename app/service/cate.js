const debug = require('debug')('cate service');

module.exports = app => {
  class Cate extends app.Service {
    async list(modal = 'cate') {
      const record = await app.mysql.select(modal);
      return { record };
    }

    async save(modal, request) {
      debug(request);
      const { id } = request;
      if (id) {
        // 更新分类
        const cate = await this.app.mysql.get(modal, { id });

        if (cate) {
          await this.app.mysql.update(modal, request);
        } else {
          return {
            success: false,
            msg: '分类不存在',
            code: 'cate not exist',
            data: null,
          };
        }
      } else {
        // 新增分类
        await this.app.mysql.insert(modal, {
          ...request,
        });
      }

      return {
        success: true,
        msg: '',
        code: '',
        data: null,
      };
    }

    async remove(modal, params) {
      const cate = await this.app.mysql.get(modal, {
        ...params,
      });

      if (cate) {
        await this.app.mysql.delete(modal, {
          ...params,
        });

        return {
          success: true,
          msg: '',
          code: '',
          data: null,
        };
      }

      return {
        success: false,
        msg: '分类不存在',
        code: 'cate not exist',
        data: null,
      };
    }
  }
  return Cate;
};
