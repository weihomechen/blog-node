-- 数据库表变更

use blog;

-- 修改团队表
ALTER TABLE team ADD abstract varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
