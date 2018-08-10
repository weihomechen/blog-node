const fs = require('fs');
const path = require('path');
const localMysqlConf = fs.existsSync(path.join(__dirname, './mysql.local.js')) ? require('./mysql.local') : {};

exports.mysql = {
  // 单数据库信息配置
  client: Object.assign({
    // host
    host: '127.0.0.1',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: '12345678',
    // 数据库名
    database: 'blog',
  }, localMysqlConf),
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
