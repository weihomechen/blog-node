-- 数据库表设计

-- ----------------------------
-- 表结构
-- ----------------------------

CREATE DATABASE IF NOT EXISTS blog;

USE blog;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NUll AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL UNIQUE,
  `password` varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `role` int(1) NOT NUll COMMENT '角色：0 —— 普通用户；1 —— 管理员；',
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '电子邮箱',
  `createTime` TIMESTAMP DEFAULT current_timestamp COMMENT '创建时间'
)
COMMENT='用户表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `uid` int(11) NOT NULl COMMENT 'user id',
  `title` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `author` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `abstract` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `cate` int(4),
  `content` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `isDeleted` int(1) NOT NULL DEFAULT 0 COMMENT '是否已被删除：0 —— 未删除；1 —— 已删除',
  `createTime` TIMESTAMP DEFAULT now() COMMENT '创建时间',
  `updateTime` TIMESTAMP DEFAULT now() ON UPDATE now() COMMENT '最后更新时间'
)
COMMENT='文章表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cate`;
CREATE TABLE `cate` (
  `id` int(4) NOT NUll AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL UNIQUE,
  `color` varchar(8) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
)
COMMENT='文章分类表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- 表记录
-- ----------------------------

-- ----------------------------
-- 初始化管理员账号
-- ----------------------------
INSERT INTO `user` VALUES(1, '沙丁', 'qweQWE123$%^', 1, 'erdongshengfu@gmail.com', null);
