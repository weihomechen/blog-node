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

