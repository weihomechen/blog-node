/**
 * 鉴权
 */
const {
  parse,
} = require('url');
const querystring = require('querystring');

module.exports = () => {
  return async function (ctx, next) {
    const url = ctx.originalUrl;
    const urlObj = parse(url);
    const {
      pathname,
      query,
    } = urlObj;
    const reg = /^\/api\//;
    const isApi = reg.test(pathname);
    const whiteList = ctx.app.config.whiteList;
    const isInWhiteList = whiteList.some(v => new RegExp(v).test(pathname));
    const sess_key = ctx.cookies.get('BLOG_SESS');
    const user = ctx.session.user;

    if (isInWhiteList) {
      if (/^\/user\/login$/.test(pathname) && user) {
        // 如果已经登录，并且访问的登录页面，则直接跳转
        const backUrl = querystring.parse(query).backUrl;
        ctx.redirect(backUrl || '/');
      } else {
        await next();
      }
    } else {
      if (!user) {
        if (isApi) {
          ctx.body = {
            success: false,
            msg: sess_key ? '登录失效，请重新登录' : '您无权访问该接口，请先登录',
            data: null,
            code: 'user need login',
          };
          ctx.status = 200;
        } else {
          ctx.redirect(`/user/login?backUrl=${encodeURIComponent(url)}`);
        }
      } else {
        await next();
      }
    }
  };
};
