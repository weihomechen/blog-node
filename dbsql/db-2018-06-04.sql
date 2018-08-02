-- 数据库变更
use blog;

-- 关闭 only_full_group_by
set sql_mode ='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- 用户表变更
ALTER TABLE user ADD cover varchar(200) DEFAULT NULL COMMENT '个人主页封面';
ALTER TABLE user ADD motto varchar(100) DEFAULT NULL COMMENT '个人座右铭';
ALTER TABLE user ADD moneyCode varchar(200) DEFAULT NULL COMMENT '个人收钱码';

-- 文章表变更
ALTER TABLE article ADD isAcceptReward int(1) DEFAULT 0 COMMENT '是否接受打赏 0 - 关闭 1 -开启';

-- 修改column的字符集：
ALTER TABLE message CHANGE content content TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
