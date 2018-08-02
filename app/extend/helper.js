const moment = require('moment');

exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();

exports.parseMsg = (action, payload = {}, metadata = {}) => {
  const meta = Object.assign({}, {
    timestamp: Date.now(),
  }, metadata);

  return {
    meta,
    data: {
      action,
      payload,
    },
  };
};

// 审批类消息模版
exports.approvalMsgTemp = (type = 0, infos = {}) => {
  const { status, name } = infos;
  switch (type) {
    case 1: // 加入团队消息
      if (status === 1) { // 同意加入
        return {
          title: `${name}同意了您加入他的团队`,
          content: '欢迎加入～请注销后重新登录哦～',
        };
      }
      return { // 拒绝加入
        title: `${name}暂时不想您加入他的团队`,
        content: '很遗憾，您可以再次发起申请～',
      };
    case 2: // 邀请加入团队消息
      if (status === 1) { // 同意加入
        return {
          title: `${name}接受了您的邀请`,
          content: `${name}已经成为团队一员`,
        };
      }
      return { // 拒绝邀请
        title: `${name}婉拒了您的邀请`,
        content: '很遗憾，您可以再次邀请Ta加入您的团队',
      };
    default: // 创建团队
      if (status === 1) { // 同意创建
        return {
          title: '系统管理员同意了您创建团队的申请',
          content: '请注销后重新登录，查看您的团队～',
        };
      }
      return { // 驳回创建
        title: '您创建团队的申请已被驳回',
        content: '很遗憾，您可以再次发起申请～',
      };
  }
};
