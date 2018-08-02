-- 数据库表变更

use blog;

-- 修改团队表
ALTER TABLE team ADD status int(1) NOT NULL DEFAULT 0 COMMENT '状态: 0 - 未启用 1 - 已启用';

-- 修改审批表
ALTER TABLE approval ADD type int(1) NOT NULL DEFAULT 1 COMMENT '审批类型：0 - 创建团队 1 - 加入团队';

-- 修改文章表
ALTER TABLE article ADD tags varchar(60) DEFAULT NULL COMMENT '文章标签：以逗号分隔';
