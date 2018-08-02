module.exports = app => {
  class Team extends app.Service {
    async list(modal = 'team', request = {}) {
      const record = await app.mysql.select(modal, { where: request });

      return record;
    }

    async detail(modal = 'team', request) {
      const record = await app.mysql.get(modal, request);

      return record;
    }

    async create(modal = 'team', request) {
      const result = await this.app.mysql.insert(modal, request);

      return result;
    }

    async update(modal = 'team', request) {
      const { tid, ...updateFields } = request;
      const result = await this.app.mysql.update(modal, request, {
        where: { tid },
        columns: Object.keys(updateFields).map(field => field),
      });

      return result;
    }

    async del(modal = 'team', request) {
      const result = await this.app.mysql.delete(modal, request);

      return result;
    }
  }
  return Team;
};
