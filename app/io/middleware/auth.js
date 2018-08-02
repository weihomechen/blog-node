const debug = require('debug')('io middleware');

module.exports = app => {
  return async (ctx, next) => {
    debug(ctx.socket.id);
    await next();
  };
};
