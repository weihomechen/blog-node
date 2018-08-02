-- 数据库表变更

use blog;

-- 修改用户表
ALTER TABLE user MODIFY password varchar(128) NOT NULL;

