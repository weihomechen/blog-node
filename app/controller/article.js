const {
  subObj,
  getFileName,
} = require('../utils');
const Controller = require('egg').Controller;
const sendToWormhole = require('stream-wormhole');

class ArticleController extends Controller {
  // 获取内容列表，分页，每页几个
  async list() {
    const { ctx, service } = this;

    let data = {};
    if (ctx.query.tid) {
      data = await service.article.teamList('article', ctx.query);
    } else {
      data = await service.article.list('article', subObj(['title', 'pageNo', 'pageSize', 'uid', 'tid', 'from', 'to', 'cate', 'tag', 'status'], ctx.query));
    }

    ctx.body = {
      success: true,
      msg: '',
      code: '',
      data,
    };
    ctx.status = 200;
  }

  // 根据ID获取内容信息
  async detail() {
    const { ctx, service } = this;
    // 调用 service 获取数据
    const data = {};
    data.article = await service.article.detail('article', subObj(['id'], ctx.query));

    if (data.article && data.status !== 2) { // 如果有查到文章（可能id错误或文章被删了）
      data.comments = await service.comment.query(subObj(['id'], ctx.query));
      ctx.body = {
        success: true,
        msg: '',
        code: '',
        data,
      };
    } else {
      ctx.body = {
        success: false,
        msg: '文章不存在',
        code: 'article not exist',
        data: null,
      };
    }

    ctx.status = 200;
  }

  // 保存内容
  async save() {
    const { ctx, service } = this;
    const response = await service.article.save('article', subObj(['id', 'title', 'abstract', 'cate', 'content', 'tags', 'isAcceptReward', 'status'], ctx.request.body));

    ctx.body = response;
    ctx.status = 200;
  }

  // 删除内容信息
  async remove() {
    const { ctx, service } = this;
    const response = await service.article.remove('article', subObj(['id'], ctx.request.body));

    ctx.body = response;
    ctx.status = 200;
  }

  // 上传图片
  async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const name = getFileName(stream.filename);
    let result;

    try {
      result = await ctx.oss.put(name, stream);
    } catch (err) {
      await sendToWormhole(stream);

      throw err;
    }

    if (result) {
      ctx.body = {
        success: true,
        msg: '',
        code: '',
        data: result,
      };
    } else {
      ctx.body = {
        success: false,
        msg: '上传失败',
        code: 'upload failed',
        data: null,
      };
    }
  }
}

module.exports = ArticleController;
