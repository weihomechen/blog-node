module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next();

    if (ctx.status === 404 && !ctx.body) {
      if (ctx.acceptJSON) {
        ctx.body = {
          success: false,
          error: {
            msg: '接口不存在',
          },
        };
      } else {
        ctx.body = '404';
      }
    }
  };
};
