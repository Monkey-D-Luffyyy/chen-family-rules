# 陈氏家法

一份在线“恋爱家法”互动网页：犯错登记、条例管理、每日三省打卡，附带**加密云端同步**，支持电脑和手机使用。

## 本地使用

直接用浏览器打开 `陈氏家法.html` 即可，数据保存在浏览器本地（localStorage）。建议定期点击页面里的 **备份数据** 按钮导出 JSON。

## 云端同步（Supabase 免费版）

数据会在浏览器端用“同步口令”加密（AES-256-GCM）后再上传，云端只存密文，看不到明文。

### 一次性配置步骤（约 10 分钟）

1. 打开 <https://supabase.com> 注册账号并创建一个免费项目。
2. 进入项目，打开左侧 **SQL Editor**，执行：

```sql
create table if not exists public.family_data (
  id text primary key,
  data text not null,
  updated_at timestamptz default now()
);

alter table public.family_data disable row level security;
```

3. 进入 **Project Settings → API**，复制 **Project URL** 和 **anon public key**。
4. 打开网页 → **云端同步 → 云同步设置**，填入：
   - 项目地址：`https://xxxx.supabase.co`
   - 匿名密钥：`eyJ...`（anon key）
   - 同步标识：两台设备填同一个，如 `chen-family-520`
   - 同步口令：≥ 8 位，两台设备填同一个，用于加密，请记牢
5. 点 **测试连接** 验证，再点 **保存并同步**。以后每次打开页面会自动双向同步。

> 说明：免费项目 + 密文存储下禁用 RLS 是最简方案；若想更严谨，可改为启用 RLS 并配置匿名读写的策略。

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
