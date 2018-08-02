-- 数据库变更
use blog;

-- 开始事务
BEGIN;

-- 文章表变更
ALTER TABLE article ADD status int(1) DEFAULT 1 COMMENT '文章状态 0 - 草稿 1 - 已发表 2 - 已删除';

-- 设置已删除文章的状态为2
UPDATE article set status = 2 where isDeleted = 1;

-- 删除原本字段
ALTER TABLE article DROP COLUMN isDeleted;

-- 分类表
-- 插入默认分类，由于id是自增的，默认模式下无法指定id（会自增）
-- 如果数据库是迭代到当前文件的，需要手动设置文章的分类为默认分类
INSERT INTO cate values(0, '其它', '#00adb5');

-- 提交事务
COMMIT;
