# 生产环境

```
yarn build
```

```
yarn server
```

访问 http://localhost:3001

# 开发环境

```
yarn serve
```

```
yarn server
```

访问 http://localhost:8080

# 项目描述

- 本项目前端采用 `vue`、`muse-ui` 以及 **MAP** 进行开发
- 本项目后端采用 `koa` 以及 **语音 API** 进行开发

| 文件夹             | 描述                       |
| ------------------ | -------------------------- |
| server/            | node 服务端源码            |
| src/               | 前端源码                   |
| vue.config.js      | 配置前端开发环境的跨域代理 |
| public/ index.html | 前端 index.html            |

## server 服务端文件夹描述

| 文件      | 描述                               |
| --------- | ---------------------------------- |
| upload/   | wav 音频文件存放目录, 16000 采样率 |
| config.js | API 配置                           |
| index.js  | 后端 koa 入口文件                  |
| router.js | 后端 API 接口编写文件              |

## src 前端文件夹描述

| 文件            | 描述                 |
| --------------- | -------------------- |
| assets/         | 存放项目字体和图标源 |
| App.vue         | App.vue 前端主页面   |
| getHighlight.js | 根据关键词得到高亮   |
| main.js         | 前端入口文件         |
