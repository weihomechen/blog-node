module.exports = app => {
  class IssueReply extends app.Service {
    async query(request) {
      const { id } = request;
      const record = await app.mysql.select('issue_reply', {
        where: {
          issue_id: id,
          status: 1,
        },
      });
      return record;
    }

    async save(request) {
      const { id } = request;
      let response = {
        success: true,
        msg: '',
        code: '',
      };
      if (id) {
        // 更新
        const issueReply = await this.app.mysql.get('issue_reply', { id });
        if (issueReply) {
          await this.app.mysql.update('issue_reply', request);
        } else {
          response = {
            success: false,
            msg: '回复不存在',
            code: 'issue_reply not exist',
          };
        }
      } else {
        // 新增回复
        await this.app.mysql.insert('issue_reply', request);
      }
      return response;
    }
  }
  return IssueReply;
};
