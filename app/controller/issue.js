const {
  subObj,
  getFileName,
} = require('../utils');
const { Controller } = require('egg');
const sendToWormhole = require('stream-wormhole');

class IssueController extends Controller {
  // 获取内容列表，分页，每页几个
  async list() {
    const { ctx, service } = this;

    let data = {};
    data = await service.issue.list('issue', subObj(['keyword', 'pageNo', 'pageSize', 'uid', 'from', 'to', 'type', 'status'], ctx.query));

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
    data.issue = await service.issue.detail('issue', subObj(['id'], ctx.query));

    if (data.issue) { // 如果有查到文章（可能id错误或文章被删了）
      data.issue.replys = await service.issueReply.query(subObj(['id'], ctx.query));
      ctx.body = {
        success: true,
        msg: '',
        code: '',
        data,
      };
    } else {
      ctx.body = {
        success: false,
        msg: '该内容不存在',
        code: 'issue not exist',
        data: null,
      };
    }

    ctx.status = 200;
  }

  // 保存内容
  async save() {
    const { ctx, service } = this;
    const response = await service.issue.save('issue', subObj(['id', 'title', 'type', 'content', 'status'], ctx.request.body));

    ctx.body = response;
    ctx.status = 200;
  }

  // 删除内容信息
  async remove() {
    const { ctx, service } = this;
    const response = await service.issue.remove('issue', subObj(['id'], ctx.request.body));

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

module.exports = IssueController;
