-- 数据库表变更

use blog;

-- 修改user表role字段的注释
ALTER TABLE user MODIFY COLUMN role int(1) NOT NUll COMMENT '角色：0 —— 普通用户；1 —— 超级管理员；2 -- 团队管理员';

-- user表增加团队id字段
ALTER TABLE user ADD tid int(11) COMMENT '团队id';

-- 增加team表
DROP TABLE IF EXISTS `team`;
CREATE TABLE `team` (
  `tid` int(11) NOT NUll AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL UNIQUE,
  `avatar` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `creater` int(11) NOT NUll COMMENT '创建者',
  `owner` int(11) NOT NUll COMMENT '团队管理员',
  `createTime` TIMESTAMP DEFAULT current_timestamp COMMENT '创建时间'
)
COMMENT='团队表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

