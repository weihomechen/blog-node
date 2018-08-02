-- 数据库表变更

-- 修改database的字符集：
ALTER DATABASE blog CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

use blog;

-- 修改table的字符集：
ALTER TABLE article CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 修改column的字符集：
ALTER TABLE article CHANGE content content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


