module.exports = app => {
  class Comment extends app.Service {
    async query(request) {
      const { id } = request;
      const record = await app.mysql.select('comment', {
        where: {
          article_id: id,
          isDeleted: 0,
        },
        orders: [['createTime', 'desc']],
      });
      await this.app.mysql.beginTransactionScope(async (conn) => {
        await Promise.all(record.map(async (item) => {
          item.replyList = await conn.select('reply', {
            where: {
              comment_id: item.id,
              isDeleted: 0,
            },
            orders: [['createTime', 'desc']],
          });
        }));
      });
      return record;
    }

    async save(request) {
      // 新增评论
      const { insertId: id } = await this.app.mysql.insert('comment', {
        ...request,
      });

      const record = await this.app.mysql.get('comment', { id });
      record.replyList = [];

      return {
        success: true,
        msg: '',
        code: '',
        data: record,
      };
    }

    async remove(params) {
      const comment = await this.app.mysql.get('comment', {
        ...params,
      });

      if (comment) {
        await this.app.mysql.update('comment', { isDeleted: 1 }, {
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
        msg: '评论不存在',
        code: 'comment not exist',
        data: null,
      };
    }
  }
  return Comment;
};
