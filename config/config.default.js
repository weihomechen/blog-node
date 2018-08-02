/* eslint-disable no-multi-spaces */
exports.keys = 'znkey';

exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.tpl': 'nunjucks',
  },
};

// mount middleware
exports.middleware = [
  'auth',
];

exports.errorHandler = {
  match: '/api',
};

// middleware config
exports.robot = {
  ua: [
    /curl/i,
    /Baiduspider/i,
  ],
};

exports.security = {
  ignore: '/api/',
  domainWhiteList: ['http://127.0.0.1:8080', 'http://10.180.144.212:8080', 'http://localhost:8080'],
  methodnoallow: { enable: false },
  csrf: {
    enable: false,
    ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
  },
};

exports.cors = {
  allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
};

exports.multipart = {
  fileExtensions: ['.xls', '.doc', '.ppt', '.docx', '.xlsx', '.pptx'],
};

exports.redis = {
  client: {
    host: '127.0.0.1',
    port: '6379',
    password: '',
    db: '5',
  },
};

exports.sessionRedis = {
  name: '',
};

exports.session = {
  key: 'BLOG_SESS',
  maxAge: 24 * 3600 * 1000, // 1天
  httpOnly: true,
  encrypt: true,
};

// 免登白名单
exports.whiteList = [
  '^/$',                  // 首页
  '^/login$',             // 登录页面

  '^/api/user/info',      // 获取用户信息
  '^/api/user/login$',    // 用户登录接口
  '^/api/user/register$', // 用户注册接口

  '^/api/article/list$',  // 获取文章列表
  '^/api/article/detail', // 获取文章详情
  '^/api/cate/list$',     // 获取分类列表
];

exports.robotEmail = {
  host: 'smtp.qq.com',
  port: 587,
  secure: false,
  user: '3552395058@qq.com',
  pass: 'xsuinzayxwkscjgf',
  from: '微蚁小莉<3552395058@qq.com>',
};

exports.bodyParser = {
  jsonLimit: '5mb',
  formLimit: '6mb',
};

exports.oss = {
  client: {
    accessKeyId: 'LTAI4Sm0m8EQCGMD',
    accessKeySecret: 'p7UBpLBuQMWuE1uX7de9IrphhP1nKN',
    bucket: 'chenshengfu',
    endpoint: 'oss-cn-shanghai.aliyuncs.com',
    timeout: '60s',
    secure: true,
  },
};

exports.io = {
  init: {
    wsEngine: 'uws',
  },
  namespace: {
    '/': {
      connectionMiddleware: ['auth'],
      packetMiddleware: ['filter'],
    },
  },
  redis: {
    host: '127.0.0.1',
    port: '6379',
    auth_pass: '',
    db: '6',
  },
};
