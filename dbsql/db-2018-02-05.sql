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
