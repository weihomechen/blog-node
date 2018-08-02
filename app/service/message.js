const debug = require('debug')('message service');

module.exports = app => {
  class Message extends app.Service {
    async create(modal = 'message', request, type = 1) {
      request.type = type;
      let receiver;
      if (+type === 2) {
        // 评论回复类
        let { article_id } = request;
        const { author, to, content, comment_id } = request;
        const title = `写了一条新${to ? '回复' : '评论'}`;
        const { uid: sender } = await this.app.mysql.get('user', { name: author });
        if (to) {
          // 回复类
          receiver = (await this.app.mysql.get('user', { name: to })).uid;
          article_id = (await this.app.mysql.get('comment', { id: comment_id })).article_id; // eslint-disable-line
        } else {
          // 评论类
          receiver = (await this.app.mysql.get('article', { id: article_id })).uid;
        }
        request = {
          type,
          title,
          content,
          article_id,
          sender,
          receiver,
        };
      }
      const result = await this.app.mysql.insert(modal, request);

      if (result) {
        receiver = receiver || request.receiver;
        const socketId = await this.app.redis.get(receiver);
        const sockets = this.app.io.sockets.connected[socketId];
        const nsp = this.app.io.of('/');

        if (socketId && sockets) {
          await nsp.emit('message', '您有新的消息');
        }
      }

      return result;
    }

    async list(modal = 'message', query) {
      const {
        pageNo = 1,
        pageSize = 10,
        uid,
        type = 1,
      } = query;
      const offset = (pageNo - 1) * pageSize;

      const record = await app.mysql.query('SELECT * FROM message WHERE type = ? and (receiver = ? OR receiver = 0) order by createTime desc LIMIT ? OFFSET ?;', [+type, uid, +pageSize, offset]);

      await this.app.mysql.beginTransactionScope(async (conn) => {
        await Promise.all(
          record.map(async (item) => {
            if (item.sender === 0) {
              item.senderName = '系统';
            } else {
              const user = await conn.get('user', {
                uid: item.sender,
              });
              // 返回发送者的名称和头像url
              item.senderName = user.name;
              item.senderAvatar = user.avatar;
            }
            if (item.article_id) {
              // 附带返回文章标题
              const article = await conn.get('article', { id: item.article_id });
              item.articleTitle = article.title;
            }
          }));
      });

      const totalCount = await app.mysql.query('SELECT COUNT(*) as total FROM message a WHERE a.type= ? and (a.receiver = ? OR a.receiver = 0);', [+type, uid]);

      debug('return');
      return { record, totalCount: totalCount[0].total };
    }

    async getUnReadTotal(modal = 'message', query) {
      const { uid } = query;


      const unRead = await app.mysql.query('SELECT COUNT(*) as total FROM message a WHERE a.status= 0 and (a.receiver = ? OR a.receiver = 0);', [uid]);
      const unReadSysMsg = await app.mysql.query('SELECT COUNT(*) as total FROM message a WHERE a.status= 0 and type = 1 and (a.receiver = ? OR a.receiver = 0);', [uid]);
      const unReadDisMsg = await app.mysql.query('SELECT COUNT(*) as total FROM message a WHERE a.status= 0 and type = 2 and (a.receiver = ? OR a.receiver = 0);', [uid]);

      return {
        unReadTotal: unRead[0].total,
        unReadSysMsgTotal: unReadSysMsg[0].total,
        unReadDisMsgTotal: unReadDisMsg[0].total,
      };
    }

    async update(request, modal = 'message') {
      // 如果该消息是发给多人的，那阅读状态就不止0和1了，如果想控制每个接收者的已读未读，
      // 那就需要发送多条消息，每个接收者发一条，那接收者为0（全员）也就没意义了
      let success = false;
      const { mid, ...updateFields } = request;
      const { affectedRows } = await this.app.mysql.update(modal, request, {
        where: { mid },
        columns: Object.keys(updateFields).map(field => field),
      });
      success = affectedRows === 1;
      return { success };
    }
  }
  return Message;
};
