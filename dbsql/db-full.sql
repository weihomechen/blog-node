-- 数据库表设计

-- ----------------------------
-- 表结构
-- ----------------------------

CREATE DATABASE IF NOT EXISTS blog;

USE blog;

-- 修改database的字符集：
ALTER DATABASE blog CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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
INSERT INTO `user` VALUES(1, '墨鱼', '123456', 1, 'moyu@gmail.com', null);

-- 修改table的字符集：
ALTER TABLE article CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 修改column的字符集：
ALTER TABLE article CHANGE content content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 数据库表变更
-- 新增文章评论表和评论回复表

use blog;

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `article_id` int(10) NOT NULL COMMENT '评论的文章id',
  `author` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `content` text NOT NULL,
  `createTime` TIMESTAMP DEFAULT now() COMMENT '创建时间',
  `updateTime` TIMESTAMP DEFAULT now() ON UPDATE now() COMMENT '最后更新时间',
  `isDeleted` int(1) NOT NULL DEFAULT 0 COMMENT '是否已被删除：0 —— 未删除；1 —— 已删除',
  FOREIGN KEY(article_id) REFERENCES article(id)
)
COMMENT='文章评论表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `reply`;
CREATE TABLE `reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `comment_id` int(10) NOT NULL COMMENT '回复的评论id',
  `author` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `to` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL COMMENT '回复的对象',
  `content` text NOT NULL,
  `createTime` TIMESTAMP DEFAULT now() COMMENT '创建时间',
  `updateTime` TIMESTAMP DEFAULT now() ON UPDATE now() COMMENT '最后更新时间',
  FOREIGN KEY(comment_id) REFERENCES comment(id)
)
COMMENT='评论回复表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 数据库表变更

use blog;

-- 修改用户表
ALTER TABLE user ADD avatar varchar(200);

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

-- 数据库表变更

use blog;

-- 修改评论表
ALTER TABLE reply ADD isDeleted int(1) NOT NULL DEFAULT 0 COMMENT '是否已被删除：0 —— 未删除；1 —— 已删除';

-- 数据库表变更

use blog;

-- 修改团队表
ALTER TABLE team ADD abstract varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 数据库表变更

use blog;

-- 增加message表
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `mid` int(11) NOT NUll AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `content` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `sender` int(11) NOT NUll COMMENT '发送者：0 - 系统； 其他 - uid',
  `receiver` int(11) NOT NUll COMMENT '接收者：0 - 全部成员； 其他 - uid',
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '状态：0 - 未读; 1 - 已读',
  `createTime` TIMESTAMP DEFAULT now() COMMENT '创建时间',
  `updateTime` TIMESTAMP DEFAULT now() ON UPDATE now() COMMENT '最后更新时间'
)
COMMENT='消息表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 增加approval表
DROP TABLE IF EXISTS `approval`;
CREATE TABLE `approval` (
  `aid` int(11) NOT NUll AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `applicant` int(11) NOT NUll COMMENT '申请者',
  `approver` int(11) NOT NUll COMMENT '审批者',
  `status` int(1) NOT NUll DEFAULT 0 COMMENT '状态：0 - 未处理；1 - 同意； 2 - 驳回',
  `reason` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `createTime` TIMESTAMP DEFAULT now() COMMENT '创建时间',
  `updateTime` TIMESTAMP DEFAULT now() ON UPDATE now() COMMENT '最后更新时间'
)
COMMENT='审批表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 数据库表变更

use blog;

-- 修改消息表
ALTER TABLE message ADD type int(1) NOT NUll COMMENT '类型：1 —— 系统通知；2 —— 文章评论回复；';
ALTER TABLE message ADD article_id varchar(11) COMMENT '附带的文章ID，type为1时需填';

-- 数据库表变更

use blog;

-- 修改团队表
ALTER TABLE team ADD status int(1) NOT NULL DEFAULT 0 COMMENT '状态: 0 - 未启用 1 - 已启用';

-- 修改审批表
ALTER TABLE approval ADD type int(1) NOT NULL DEFAULT 1 COMMENT '审批类型：0 - 创建团队 1 - 加入团队';

-- 修改文章表
ALTER TABLE article ADD tags varchar(60) DEFAULT NULL COMMENT '文章标签：以逗号分隔';

-- 数据库表变更

use blog;

-- 修改用户表
ALTER TABLE user MODIFY password varchar(128) NOT NULL;

-- 数据库变更
use blog;

-- 关闭 only_full_group_by
set sql_mode ='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- 用户表变更
ALTER TABLE user ADD cover varchar(200) DEFAULT NULL COMMENT '个人主页封面';
ALTER TABLE user ADD motto varchar(100) DEFAULT NULL COMMENT '个人座右铭';
ALTER TABLE user ADD moneyCode varchar(200) DEFAULT NULL COMMENT '个人收钱码';

-- 文章表变更
ALTER TABLE article ADD isAcceptReward int(1) DEFAULT 0 COMMENT '是否接受打赏 0 - 关闭 1 -开启';

-- 修改column的字符集：
ALTER TABLE message CHANGE content content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- 数据库变更
use blog;

-- 开始事务
BEGIN;

-- 新增issue表
DROP TABLE IF EXISTS `issue`;
CREATE TABLE `issue` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `author` int(11) NOT NULl COMMENT '创建者id',
  `type` int(1) NOT NULL DEFAULT 0 COMMENT '类型：0 - advice 1 - bug',
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `content` text NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '状态：0 - 已关闭 1 - 开启中',
  `createTime` TIMESTAMP DEFAULT now() COMMENT '创建时间',
  `updateTime` TIMESTAMP DEFAULT now() ON UPDATE now() COMMENT '最后更新时间'
)
COMMENT='Issue表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 新增issue回复表
DROP TABLE IF EXISTS `issue_reply`;
CREATE TABLE `issue_reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `issue_id` int(11) NOT NULL COMMENT '回复的issue id',
  `author` int(11) NOT NULL COMMENT '创建者id',
  `content` text NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '状态：0 - 已删除 1 - 正常 ',
  `createTime` TIMESTAMP DEFAULT now() COMMENT '创建时间',
  `updateTime` TIMESTAMP DEFAULT now() ON UPDATE now() COMMENT '最后更新时间',
  FOREIGN KEY(issue_id) REFERENCES issue(id)
)
COMMENT='issue回复表'
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 提交事务
COMMIT;
