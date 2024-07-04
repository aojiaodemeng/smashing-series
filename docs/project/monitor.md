## 引言

项目主要分为三个部分：

- monitor-web：数据展示系统，技术栈：React18+Antd+Ahooks
- monitor-express：监控系统服务端，技术栈：Express+Mysql+Sequelize
- monitor-sdk：监控系统核心 SDK

监控的内容：

- 错误统计
- 行为日志统计
- PV/UV 统计
  - PV：页面浏览量，用来表示该页面的访问数量
  - UV：一天内访问该网站的用户数

## 设计方案细节

### 1.数据上报类型

对于上报的数据类型，服务端分为四种：

```js
type dataType = 'action' | 'error' | 'visit' | 'user';
```

- action: 上报行为日志
- error: 用于上报错误信息
- visit: 用于统计 PV，在 onload 事件里进行上报
- user: 用于统计 UV，在 SDK 初始化时上报一条数据即可

### 2.数据表设计

根据数据上报的类型，这里设计四张数据表：

- error
- userAction
- userLog
- visitor

### 3.SDK 初始化需要的配置信息

## Mysql 相关命令

### 关闭 Mysql

```yaml
# 查看mysql 的 pid
ps -ef | grep mysqld
sudo kill ****
```

## 项目`monitor-express`初始化

### 1.初始化

```js
mkdir monitor-express
cd monitor-express
npm init
npm install express mysql2 sequelize
```

### 2.连接数据库

参考文档：

- [Express+ts 使用 Sequelize 进行 mysql 操作](https://blog.csdn.net/weixin_73235090/article/details/134899696)

```js
// 新建db.js
const { Sequelize } = require('sequelize');

const db = new Sequelize('monitor', 'root', 'root1234', {
  host: 'localhost',
  port: '3306',
  dialect: 'mysql',
});

module.exports = db;
```

- monitor 是数据库名
- root 和 root1234 分别是数据库用户名和密码

```js
// 新建app.js
const express = require('express');
const db = require('./db');

async function testConnectDb() {
  try {
    await db.authenticate();
    console.log('-----数据库已连接------');
  } catch (error) {
    console.error('无法连接到数据库:', error);
  }
}
testConnectDb();

const app = express();
const port = 3010;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

执行命令：

```yaml
node app.js
```

### 3.创建数据模型实例

创建`models/users.js`:

```js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Users = db.define(
  'users',
  {
    appId: {
      type: DataTypes.STRING,
      allowNull: false, // 不为空
      primaryKey: true,
      field: 'appId', //表映射
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'userId',
    },
    ua: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'ua',
    },
  },
  {
    timestamps: true, // 是否禁用自动创建的时间戳字段
    updatedAt: 'updateTime',
    createdAt: 'createTime',
  },
);

module.exports = Users;
```

创建`models/index.js`:

```js
const Users = require('./users');

async function go() {
  await Users.sync({ force: true }); // 加了{ force: true } ，每次项目启动时都会清除数据库，不要加这个
}
go();

module.exports = {
  Users,
};
```

然后执行命令：

```yaml
node models/index.js
```

刷新数据库就可以看到自动创建好一张 users 表了。下面还要补上其他三张表。

创建`models/visit.js`:

```js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Visit = db.define(
  'visit',
  {
    appId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stayTime: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    currentPage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ua: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // 是否禁用自动创建的时间戳字段
    updatedAt: 'updateTime',
    createdAt: 'createTime',
    tableName: 'visit', // 明确指定表名，不要加s
  },
);

module.exports = Visit;
```

创建`models/actions.js`:

```js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Actions = db.define(
  'actions',
  {
    appId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    actionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    currentPage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ua: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // 是否禁用自动创建的时间戳字段
    updatedAt: 'updateTime',
    createdAt: 'createTime',
  },
);

module.exports = Actions;
```

创建`models/errors.js`:

```js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Errors = db.define(
  'errors',
  {
    appId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    errorType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    errorMsg: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    col: {
      type: DataTypes.INTEGER,
    },
    row: {
      type: DataTypes.INTEGER,
    },
    currentPage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ua: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // 是否禁用自动创建的时间戳字段
    updatedAt: 'updateTime',
    createdAt: 'createTime',
  },
);

module.exports = Errors;
```

## 项目`monitor-sdk`初始化

### 1.初始化

```js
mkdir monitor-sdk
cd monitor-sdk
npm init
```

### 2.实现 uv 上报

