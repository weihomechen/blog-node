-- 数据库表变更

use blog;

-- 修改评论表
ALTER TABLE reply ADD isDeleted int(1) NOT NULL DEFAULT 0 COMMENT '是否已被删除：0 —— 未删除；1 —— 已删除';
