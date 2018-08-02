const debug = require('debug')('io controller');
const { Controller } = require('egg');

class McController extends Controller {
  async connect() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const { socket } = ctx;
    const client = socket.id;

    try {
      const { target, payload } = message;
      if (!target) return;
      const msg = ctx.helper.parseMsg('connect', payload, { client, target });
      nsp.emit(target, msg);
    } catch (error) {
      app.logger.error(error);
    }
  }

  async disconnect() {
    const message = this.ctx.args[0];
    console.log(message);
  }
}

module.exports = McController;
