# blog-node 全栈博客node服务端

## 概述

主要技术栈：

- node: JS在服务器的运行环境
- egg: node框架
- mysql: 数据库
- redis: 缓存和数据存储

主要实现的功能：

- Http服务器和路由表，监听前端发起的请求
- 提供API接口服务，供前端调用以及对接口调用进行处理和响应
- 实现完整的数据库设计，存储和使用数据
- 实现数据的增删改查以及上传到阿里云等oss对象存储
- 数据缓存和查询，实现用户信息等数据缓存及使用
- 消息推送，使用websocket和前端进行消息推送

## Quick Start

### 开始之前

该项目使用了mysql，运行前请先装好mysql

#### 命令行安装mysql

如果没有安装homebrew先安装homebrew：

```
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

#### 安装包安装mysql

[mysql下载地址](https://dev.mysql.com/downloads/mysql/)，下载后跟dmg安装方法一样，一路向下，记得保存最后弹出框中的密码（它是你mysql root账号的密码）。此时只是安装成功，但还需要额外的配置：

* 进入系统偏好设置
* 点击mysql
* 开启mysql服务

此时我们在命令行输入mysql -uroot -p命令会提示没有commod not found，我们还需要将mysql加入系统环境变量。

```
// (1).进入/usr/local/mysql/bin,查看此目录下是否有mysql。
// (2).执行vim ~/.bash_profile
//    在该文件中添加mysql/bin的目录，即在最后一行添加下面这句话：
//      PATH=$PATH:/usr/local/mysql/bin
// 添加完成后，按esc，然后输入wq保存。
// 最后在命令行输入
source ~/.bash_profile
```

现在就可以通过mysql -uroot -p登录mysql了，会让你输入密码。

#### 初始化数据库

成功安装mysql后，在命令行执行下面这个命令自动初始化：

```sh
mysql -u[username] -p[password] < ./dbsql/db.sql
```

`./db.sql`即为项目根目录下的`db.sql`文件在当前目录下的相对路径，以下同。

如果是累计更新，需要执行到最新的sql文件（新旧按文件名中的日期排）；

如果是第一次初始化，可以执行总的sql文件：

```sh
mysql -u[username] -p[password] < ./dbsql/full-db.sql
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

如果没有报错，项目就会运行在 [127.0.0.1:8080](http://127.0.0.1:8080)

## 目录结构

```
├── README.md
├── app           // 后台部分
├── config        // egg配置文件
├── dispatch.js
├── logs          // 运行日志
├── node_modules
├── package.json
├── run
├── scripts      
├── static        // 前端部分 
├── test
└── db.sql    // 数据库表设计
```

## 前端流程

```
├── build               // webpack配置  
└── src
    ├── _index.js
    ├── components      // 通用或无状态组件
    ├── img
    ├── index.html
    ├── index.js
    ├── models          // 管理路由组件的状态
    │   ├── app.js
    │   └── article.js
    ├── router.js       // 前端路由配置
    ├── routes          // 路由组件
    │   ├── app.js
    │   ├── article
    │   ├── error
    │   └── logins
    ├── services        // 前端和后台交互的逻辑（发起请求）
    │   ├── app.js
    │   └── article.js 
    ├── tests
    ├── theme.js
    └── utils
```
前端路由(router) --> 渲染路由组件(routes) --> 状态管理、与后台交互，发起请求(models) --> 后台对应路由配置进行处理(app) --> 返回结果 --> 前端接收后处理(models)

## 后台流程
```
├── controller      // 处理对应的后台路由
│   ├── article.js
│   └── client.js
├── extend
│   └── helper.js
├── middleware
├── public
├── router.js       // 后台路由映射
├── service         // 后台和数据库交互逻辑
│   └── article.js
└── view
```
收到请求（router） --> 根据路由映射调用处理函数（controller） --> 与数据库交互（service） --> 返回结果（controller）

## 生产部署

```sh
deploy blog-node
```
