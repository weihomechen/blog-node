# blog-node

本项目是博客全栈应用的服务端部分

[![Build Status](https://travis-ci.com/weihomechen/blog-node.svg?branch=master)](https://travis-ci.com/weihomechen/blog-node)

## 前端部分

### React实现

[前端传送门](https://github.com/weihomechen/blog)

在线地址：[rulifun.cn/blog](http://rulifun.cn/blog)

### Vue实现(开发ing)

[前端传送门](https://github.com/weihomechen/vue-blog)

在线地址：[rulifun.cn/vue-blog](http://rulifun.cn/vue-blog)


## 关于全栈博客

该项目是一个web全栈应用，前后端分离，是笔者第一次进入服务端（node）领域的尝试。集成前端React（Vue），后端Node，数据库Mysql，缓存Redis，消息推送，文件上传，密码加密，数据存储，性能监控等功能或模块，涵盖开发、mock、proxy、生产部署、线上监控等流程，适合有一定基础的前端er入门node，体验下web全栈开发，如果能帮助到你再好不过了，希望顺手点个star哈😄。

## Quick Start

### 开始之前

该项目使用了mysql，运行前请先装好mysql

#### 安装包安装mysql

[mysql下载地址](https://dev.mysql.com/downloads/mysql/)，下载后跟dmg安装方法一样，一路向下，记得保存最后弹出框中的密码（它是你mysql root账号的密码）。此时只是安装成功，但还需要额外的配置：

* 进入系统偏好设置
* 点击mysql
* 开启mysql服务

此时我们在命令行输入mysql -uroot -p命令会提示没有commod not found，我们还需要将mysql加入系统环境变量。

```bash
# (1).进入/usr/local/mysql/bin,查看此目录下是否有mysql。
# (2).执行vi ~/.bash_profile, 在该文件中添加mysql/bin的目录，即在最后一行添加下面这句话：
# PATH=$PATH:/usr/local/mysql/bin
# 添加完成后，按esc，然后输入wq保存。
# 最后在命令行输入
source ~/.bash_profile
```

如果使用第三方bash工具需要编辑相应的配置文件，比如`zsh`，需要编辑 `.zshrc` 文件:

```bash
vim ~/.zshrc;
# 粘贴以下内容
alias mysql='/usr/local/mysql/bin/mysql'
alias mysqladmin='/usr/local/mysql/bin/mysqladmin'
```

现在就可以通过mysql -uroot -p登录mysql了，会让你输入密码。

#### 命令行安装mysql

如果没有安装homebrew先安装homebrew：

```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

使用homebrew安装mysql：

```
brew install mysql
```

linux使用yum:

```
yum install mysql
```

#### 初始化数据库

成功安装`mysql`后，在命令行执行下面这个命令自动初始化：

```sh
# cd到blog-node项目目录
mysql -u[username] -p[password] < ./dbsql/db.sql
```

`./db.sql`即为项目根目录下的`db.sql`文件在当前目录下的相对路径，以下同。

如果是累计更新，需要执行到最新的sql文件（新旧按文件名中的日期排）；

如果是第一次初始化，可以执行总的sql文件：

```sh
mysql -u[username] -p[password] < ./dbsql/db-full.sql
```

### 开始使用

安装依赖
```
cnpm i
```

本地开发
```
npm start
```

如果没有报错，项目就会运行在 [127.0.0.1:7001](http://127.0.0.1:7001)

## 目录结构

```
├── README.md
├── app             // 后台部分
│   ├── controller  // 处理业务逻辑
│   ├── extend
│   ├── io          // socket io
│   ├── middleware  // 中间件
│   ├── public      // 静态资源
│   ├── router.js   // 服务端的路由
│   ├── service     // 负责和数据库/其他服务器的交互
│   ├── utils       // 工具
│   └── view        // 页面模版
├── config          // egg配置文件
├── logs            // 运行日志
├── node_modules
├── package.json
├── run
├── test
└── db.sql          // 数据库表设计
```

## 前端的结构和流程

```
.
├── README.md
├── config                  // 配置文件
│   ├── config.js           // 构建配置
│   ├── menu.config.js      // 菜单配置
│   ├── plugin.config.js    // 插件配置
│   ├── project.config.js   // 项目配置
│   └── router.config.js    // 路由配置
├── dist              
├── lib
│   └── iconFont.js
├── package-lock.json
├── package.json
├── src
│   ├── app.ts              // 入口文件
│   ├── common              // 通用代码
│   ├── components          // 无状态组件（原则上）
│   ├── global.css          // 全局样式
│   ├── layouts             // 布局
│   ├── models              // 状态管理
│   ├── pages               // 页面路由
│   ├── services            // 和服务端的交互
│   └── utils               // 工具函数
├── tsconfig.json
├── tslint.yml
└── typings.d.ts
```

前端路由(router) --> 渲染路由组件(routes) --> 状态管理、与后台交互，发起请求(models) --> 后台对应路由配置进行处理(app) --> 返回结果 --> 前端接收后处理(models) --> 状态的变化反应到UI上

## 后台流程
```
├── controller      // 处理对应的后台路由
│   ├── article.js
│   └── client.js
├── extend
│   └── helper.js
├── middleware      // 中间件
├── public
├── router.js       // 后台路由映射
├── service         // 后台和数据库交互逻辑
│   └── article.js
└── view
```
收到请求（router） --> 根据路由映射调用处理函数（controller） --> 与数据库交互（service） --> 返回结果（controller）

## 生产部署

先安装[deploy-tool](https://github.com/weihomechen/deploy-tool)到本地

```
npm i @ifun/deploy -g
```

[deploy-tool说明](https://github.com/weihomechen/deploy-tool/blob/master/README.md)

```sh
# 部署node项目
deploy app <name>

# 示例
deploy app blog-node
```

