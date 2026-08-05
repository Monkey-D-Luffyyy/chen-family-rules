# 陈氏家法

一份在线“恋爱家法”互动网页：犯错登记、条例管理、每日三省打卡，附带**加密云端同步**，使用 **Vue 3 + Element Plus** 重构，支持电脑和手机。

## 在线地址

<https://monkey-d-luffyyy.github.io/chen-family-rules/>

## 项目结构

```
app/                 Vue 3 + Vite 工程源码
  src/store.js       数据、本地存储、加密与云端同步逻辑
  src/App.vue        页面组装
  src/components/    各功能组件
index.html           构建产物（部署用，由 app/dist 复制而来）
assets/              构建产物静态资源
```

## 本地开发

```bash
cd app
npm install
npm run dev
```

## 构建部署

```bash
cd app
npm run build
```

将 `app/dist` 下的 `index.html` 和 `assets/` 复制到仓库根目录，然后提交推送即可，GitHub Pages 会自动重新构建上线。

## 云端同步

云端连接已内置（Supabase 免费项目），两台设备**打开同一个网址即自动同步**，无需任何配置。数据在浏览器端用同步口令加密（AES-256-GCM）后上传，云端只存密文。页面会在改动后、打开时、每分钟以及切回页面时自动同步。
