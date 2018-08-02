module.exports = app => {
  class Approval extends app.Service {
    async create(modal = 'approval', request) {
      const result = await this.app.mysql.insert(modal, request);

      return result;
    }

    async list(modal = 'approval', query) {
      const {
        pageNo = 1,
        pageSize = 10,
        uid,
      } = query;
      const offset = (pageNo - 1) * pageSize;

      const record = await app.mysql.query('SELECT * FROM approval WHERE approver = ? order by updateTime desc LIMIT ? OFFSET ?;', [uid, +pageSize, offset]);

      const totalCount = await app.mysql.query('SELECT COUNT(*) as total FROM approval WHERE approver = ?;', [uid]);
      const unHandledCount = await app.mysql.query('SELECT COUNT(*) as total FROM approval WHERE approver = ? and status = 0;', [uid]);

      return {
        record,
        totalCount: totalCount[0].total,
        unHandledCount: unHandledCount[0].total,
      };
    }

    async update(request, modal = 'approval') {
      let success = false;
      const { aid, ...updateFields } = request;
      const { affectedRows } = await this.app.mysql.update(modal, request, {
        where: { aid },
        columns: Object.keys(updateFields).map(field => field),
      });
      success = affectedRows === 1;
      return { success };
    }
  }
  return Approval;
};
