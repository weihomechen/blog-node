module.exports = app => {
  class Issue extends app.Service {
    async list(modal = 'issue', query) {
      const {
        pageNo = 1,
        pageSize = 10,
        keyword,
        uid,
        from,
        to,
        type,
        status = 1,
      } = query;
      const offset = (pageNo - 1) * pageSize;
      const startTime = `${from} 00:00:00`;
      const endTime = `${to} 23:59:59`;
      const whereSql = `
      status = ?
      ${uid ? `and author = ${+uid}` : ''}
      ${keyword ? `and title like '%${keyword}%'` : ''}
      ${type ? `and type = ${+type}` : ''} 
      ${from ? 'and updateTime between ? and ? ' : ''}`;
      const record = await app.mysql.query(
        `select * from ${modal} where ${whereSql} order by updateTime desc LIMIT ${pageSize} OFFSET ${offset};`,
        [+status, startTime, endTime],
      );
      const { totalCount } = (await app.mysql.query(`select count(*) as totalCount from ${modal} where ${whereSql};`, [+status, startTime, endTime]))[0];

      await this.app.mysql.beginTransactionScope(async (conn) => {
        record.forEach(async (item) => {
          item.replys = await conn.count('issue_reply', { issue_id: item.id, status: 1 });
        });
      });


      return { record, totalCount };
    }

    async detail(modal, query) {
      const record = await this.app.mysql.get(modal, {
        ...query,
      });

      return record;
    }

    async save(modal, request) {
      const { ctx } = this;
      const { id } = request;
      request.author = ctx.session.user.uid;

      if (id) {
        // 更新
        const issue = await app.mysql.get(modal, { id });

        if (issue) {
          // 不一定是作者更新的，避免作者被重写
          delete request.author;
          await app.mysql.update(modal, request);
        } else {
          return {
            success: false,
            msg: '文章不存在',
            code: 'issue not exist',
            data: null,
          };
        }
      } else {
        // 新建
        await app.mysql.insert(modal, {
          ...request,
          createTime: new Date(),
        });
      }

      return {
        success: true,
        msg: '',
        code: '',
        data: null,
      };
    }
  }
  return Issue;
};
