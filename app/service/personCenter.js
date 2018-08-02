module.exports = app => {
  class PersonCenter extends app.Service {
    // 根据当前用户获取文章列表
    async index(modal = 'article', query = {}) {
      const { author, title, type, from, to, sortField, sortOrder, page, pageSize } = query;
      const limit = parseInt(pageSize, 10);
      const startIndex = (parseInt(page, 10) - 1) * limit;
      // egg-mysql 不支持模糊查询和between，马丹，这么重要的功能都不支持只好手动拼接sql语句了,很丑,不忍心看
      const queryStr = `where ${author ? `author='${query.author}' and ` : ''}${title ? `title like '%${title}%' and ` : ''}type='${type}' and dateTime between '${from} 00:00:00' and '${to} 23:59:59' order by ${sortField} ${sortOrder}`;
      const recordSql = `select * from ${modal} ${queryStr} limit ${startIndex},${limit}`;
      const record = await app.mysql.query(recordSql);
      const totalSql = `select count(*) as total from ${modal} ${queryStr} `;
      const totalRecord = await app.mysql.query(totalSql);
      return { record, totalRecord: totalRecord[0].total };
    }
    // 删除自己的文章
    async destroy(modal = 'article', params) {
      const ids = params.ids.split(',');
      ids.forEach(async (id) => await this.app.mysql.delete(modal, { id }))
      return { success: true };
    }
  }
  return PersonCenter;
};
