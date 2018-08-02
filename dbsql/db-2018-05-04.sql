-- 数据库表变更

use blog;

-- 修改消息表
ALTER TABLE message ADD type int(1) NOT NUll COMMENT '类型：1 —— 系统通知；2 —— 文章评论回复；';
ALTER TABLE message ADD article_id varchar(11) COMMENT '附带的文章ID，type为1时需填';
