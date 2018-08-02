const debug = require('debug')('article service');

module.exports = app => {
  class Article extends app.Service {
    async list(modal = 'article', query) {
      const {
        pageNo = 1,
        pageSize = 10,
        title,
        uid,
        from,
        to,
        cate,
        tag,
        status = 1,
      } = query;
      const offset = (pageNo - 1) * pageSize;
      const startTime = `${from} 00:00:00`;
      const endTime = `${to} 23:59:59`;
      const whereSql = `
      status = ?
      ${uid ? `and uid = ${+uid}` : ''}
      ${title ? `and title like '%${title}%'` : ''}
      ${cate ? `and cate = ${+cate}` : ''} 
      ${tag ? `and tags like '%${tag}%'` : ''} 
      ${from ? 'and createTime between ? and ? ' : ''}`;
      const record = await app.mysql.query(
        `select * from ${modal} where ${whereSql} order by createTime desc LIMIT ${pageSize} OFFSET ${offset};`,
        [+status, startTime, endTime],
      );
      const { totalCount } = (await app.mysql.query(`select count(*) as totalCount from ${modal} where ${whereSql};`, [+status, startTime, endTime]))[0];

      await this.app.mysql.beginTransactionScope(async (conn) => {
        record.forEach(async (item) => {
          item.comments = await conn.count('comment', { article_id: item.id, isDeleted: 0 });
        });
      });

      debug(totalCount);

      return { record, totalCount };
    }

    async teamList(modal = 'article', query) {
      const {
        pageNo = 1,
        pageSize = 10,
        tid,
      } = query;
      const offset = (pageNo - 1) * pageSize;

      // 如果以表字段排序，可以分页，加上获取评论数，是11次查询
      // 如果以评论数排序, 先查所有的文章，然后每篇再查评论数，然后再排序？
      // 如果文章有1000篇，那就要执行1+1000次数据库查询操作了。。。
      // 评论数应该存储在文章表？可是这样每次评论增减时都要手动关联文章，耦合又很严重。。。
      const record = await app.mysql.query('SELECT a.* FROM article a, user b WHERE a.uid = b.uid AND b.tid = ? AND a.status = 1 order by updateTime desc LIMIT ? OFFSET ?;', [tid, +pageSize, offset]);

      const totalCount = await app.mysql.query('SELECT COUNT(*) FROM article a, user b WHERE a.uid = b.uid AND b.tid = ? AND a.status = 1;', [tid]);

      await this.app.mysql.beginTransactionScope(async (conn) => {
        record.forEach(async (item) => {
          item.comments = await conn.count('comment', { article_id: item.id, isDeleted: 0 });
        });
      });

      debug(record);
      debug(totalCount);

      return { record, totalCount: totalCount[0]['COUNT(*)'] };
    }

    async detail(modal, query) {
      const record = await this.app.mysql.get(modal, {
        ...query,
      });

      return record;
    }

    async save(modal, request) {
      const { ctx, service } = this;
      const { id } = request;
      const { uid, tid, name } = ctx.session.user;
      request.author = name;

      if (id) {
        // 更新文章
        const article = await app.mysql.get(modal, {
          uid,
          id,
        });

        if (article) {
          await app.mysql.update(modal, request);
        } else {
          return {
            success: false,
            msg: '文章不存在',
            code: 'article not exist',
            data: null,
          };
        }
      } else {
        // 新建文章
        const { insertId } = await app.mysql.insert(modal, {
          ...request,
          uid,
          createTime: new Date(),
        });

        // 如果是发表文章，生成消息给团队其他成员
        // 因为文章可以在草稿和发布之间切换，导致无法确定是不是第一次发表
        // 每次编辑后如果点发表都要发消息么，这样可能一篇文章会推送好多条重复的消息
        // if (request.status === 1) {
        //   const teamMembers = await app.mysql.select('user', {
        //     where: { tid },
        //     columns: ['uid'],
        //   });
        //   await this.app.mysql.beginTransactionScope(async () => {
        //     await Promise.all(teamMembers.map(async (item) => {
        //       if (item.uid !== uid) {
        //         await service.message.create('message', {
        //           type: 1,
        //           title: `团队的小伙伴${name}发表了新文章`,
        //           content: '快来强势围观～',
        //           sender: uid,
        //           receiver: item.uid,
        //           article_id: insertId,
        //         });
        //       }
        //     }));
        //   });
        // }
      }

      return {
        success: true,
        msg: '',
        code: '',
        data: null,
      };
    }

    async remove(modal, params) {
      const { uid } = this.ctx.session.user;
      const ids = params.id.split(',');
      let res = {
        success: true,
        msg: '',
        code: '',
        data: null,
      };
      // 批量删除
      const result = await this.app.mysql.beginTransactionScope(async (conn) => {
        await ids.forEach(async (id) => {
          const article = await conn.get(modal, {
            id,
            uid,
          });
          if (article) {
            await conn.update(modal, {
              id,
              status: 2,
            });
          } else {
            res = {
              success: false,
              msg: '文章或草稿不存在',
              code: '',
              data: null,
            };
          }
        });
        return res;
      });
      return result;
    }
  }
  return Article;
};
