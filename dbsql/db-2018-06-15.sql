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
