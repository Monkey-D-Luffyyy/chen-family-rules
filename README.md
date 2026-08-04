# 陈氏家法

一份在线“恋爱家法”互动网页：犯错登记、条例管理、每日三省打卡，附带**加密云端同步**，支持电脑和手机使用。

## 在线地址

<https://monkey-d-luffyyy.github.io/chen-family-rules/>

已部署在 GitHub Pages（HTTPS）。修改代码后执行 `git add .` + `git commit` + `git push`，Pages 会自动重新构建上线。

## 本地使用

直接用浏览器打开 `陈氏家法.html` 即可，数据保存在浏览器本地（localStorage）。建议定期点击页面里的 **备份数据** 按钮导出 JSON。

## 云端同步（已内置，无需配置）

云端连接已写死在网页里（Supabase 免费项目），两台设备**打开同一个网址即可自动同步**，不需要任何设置。数据会先在浏览器端加密再上传，云端只存密文。

### 一次性初始化（只需在 Supabase 后台执行一次 SQL）

1. 登录 <https://supabase.com/dashboard>，进入项目。
2. 左侧菜单打开 **SQL Editor** → **New query**，粘贴并 **Run**：

```sql
create table if not exists public.family_data (
  id text primary key,
  data text not null,
  updated_at timestamptz default now()
);

alter table public.family_data disable row level security;
```

执行成功后，页面每次打开都会自动双向同步，无需再做任何配置。

> 高级设置：网页“云端同步 → 高级设置”可查看/更换云端地址、密钥、同步标识和加密口令，一般用户无需改动。注意：由于网站是公开部署，内置口令在网页源码中可见，隐私主要依赖网址隐蔽性；如需更严密的保护，可在高级设置中自定义口令。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个仓库（如 `chen-family-rules`）。
2. 在项目目录执行：

```bash
git init
git add .
git commit -m "陈氏家法"
git branch -M main
git remote add origin https://github.com/<你的用户名>/chen-family-rules.git
git push -u origin main
```

3. 打开仓库 **Settings → Pages**，Source 选择 **Deploy from a branch**，分支选 `main`，目录选 `/root`，保存。
4. 等 1–2 分钟，访问 `https://<你的用户名>.github.io/chen-family-rules/`（GitHub Pages 自带 HTTPS，云同步的加密功能需要 HTTPS 环境，正好满足）。
