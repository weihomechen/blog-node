const debug = require('debug')('reply service');

module.exports = app => {
  class Reply extends app.Service {
    async query(request) {
      const { id } = request;
      const record = await app.mysql.select('reply', {
        where: {
          comment_id: id,
          isDeleted: 0,
        },
      });
      return record;
    }

    async save(request) {
      // 新增回复
      const { insertId: id } = await this.app.mysql.insert('reply', {
        ...request,
      });

      const record = await this.app.mysql.get('reply', { id });

      return {
        success: true,
        msg: '',
        code: '',
        data: record,
      };
    }

    async remove(params) {
      const reply = await this.app.mysql.get('reply', {
        ...params,
      });

      if (reply) {
        await this.app.mysql.update('reply', { isDeleted: 1 }, {
          where: { ...params },
          columns: ['isDeleted'],
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
        msg: '回复不存在',
        code: 'reply not exist',
        data: null,
      };
    }
  }
  return Reply;
};
