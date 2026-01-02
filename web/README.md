本目录是电商模板的 Next.js 14 应用源码，基于 App Router、TypeScript、Tailwind 4、Shadcn/UI、Prisma + SQLite、NextAuth、Zustand。

## 快速开始

1) 安装依赖

```bash
npm install
# 或 pnpm install / yarn install / bun install
```

2) 配置环境变量（复制示例即可本地跑通）

```bash
cp .env.example .env
# 如在 Windows PowerShell: cp .env.example .env
```

关键变量：
- DATABASE_URL=file:./dev.db（默认 SQLite 文件）
- NEXTAUTH_SECRET=随机字符串
- NEXTAUTH_URL=http://localhost:3000

3) 初始化数据库与种子数据

```bash
npm run db:push   # 同步 schema 到 SQLite
npm run db:seed   # 写入演示账号与商品
npm run db:studio # 可视化查看数据（可选）
```

4) 启动开发服务器

```bash
npm run dev
# 浏览器打开 http://localhost:3000
```

## 账号与角色
- 管理员：admin@example.com / admin123
- 普通用户：user@example.com / user123

## 常用脚本
- `npm run dev`：开发模式
- `npm run build && npm start`：生产构建与启动
- `npm run lint`：代码检查
- `npm run db:push`：同步 Prisma schema
- `npm run db:seed`：播种演示数据
- `npm run db:studio`：打开 Prisma Studio

## 结构概览
- `src/app`：路由与页面（App Router）
- `src/components`：Shadcn/UI 组件与 Provider
- `src/lib`：Prisma 客户端、认证配置、工具函数
- `prisma/schema.prisma`：数据模型
- `prisma/seed.ts`：种子脚本
