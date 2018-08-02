
// const cors = require('koa-cors');

module.exports = (app) => {
  app.get('/api/user/info', 'user.info');
  app.get('/api/user/list', 'user.list');
  app.get('/api/user/active', 'user.active');
  app.put('/api/user/update', 'user.update');
  app.put('/api/user/exitTeam', 'user.exitTeam');
  app.post('/api/user/kicked', 'user.kicked');
  app.post('/api/user/login', 'user.login');
  app.post('/api/user/logout', 'user.logout');
  app.post('/api/user/register', 'user.register');
  app.post('/api/user/agree', 'user.agree');
  app.post('/api/user/reject', 'user.reject');
  app.post('/api/user/upload', 'user.upload');
  app.post('/api/user/join', 'user.join');
  app.post('/api/user/connect', 'user.connect');
  app.post('/api/user/invite', 'user.invite');

  app.get('/api/article/list', 'article.list');
  app.post('/api/article/save', 'article.save');
  app.get('/api/article/detail', 'article.detail');
  app.post('/api/article/remove', 'article.remove');
  app.post('/api/article/upload', 'article.upload');

  app.get('/api/personCenter', 'personCenter.index');
  app.del('/api/personCenter', 'personCenter.destroy');

  app.get('/api/cate/list', 'cate.list');
  app.post('/api/cate/save', 'cate.save');
  app.post('/api/cate/remove', 'cate.remove');

  app.post('/api/comment/save', 'comment.save');
  app.post('/api/comment/remove', 'comment.remove');

  app.post('/api/reply/save', 'reply.save');
  app.post('/api/reply/remove', 'reply.remove');

  app.get('/api/team/getList', 'team.list');
  app.post('/api/team/create', 'team.create');
  app.post('/api/team/update', 'team.update');
  app.post('/api/team/upload', 'team.upload');
  app.get('/api/team/detail', 'team.detail');

  app.get('/api/message/getList', 'message.list');
  app.get('/api/message/getUnReadTotal', 'message.getUnReadTotal');
  app.post('/api/message/update', 'message.update');
  app.post('/api/message/create', 'message.create');

  app.get('/api/approval/getList', 'approval.list');
  app.post('/api/approval/update', 'approval.update');

  app.get('/api/issue/list', 'issue.list');
  app.get('/api/issue/detail', 'issue.detail');
  app.post('/api/issue/save', 'issue.save');
  app.post('/api/issueReply/save', 'issueReply.save');
  app.post('/api/issueReply/remove', 'issueReply.remove');

  // socket.io
  app.io.of('/').route('connect', app.io.controller.mc.connect);
  app.io.of('/').route('disconnect', app.io.controller.mc.disconnect);
};
