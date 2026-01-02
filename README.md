# Local-E-commerce-platform
一个基于Next.js 14 + TypeScript + Tailwind CSS + Shadcn/UI 的用来尝试 ai vibe coding 的本地电商平台项目

> 基于聊天记录提炼的实施计划，面向本地运行的完整电商平台。技术栈：Next.js 14、TypeScript、Tailwind CSS、Shadcn/UI、Prisma + SQLite、NextAuth、Zustand。

## 目标与范围
- 用户端：注册/登录、商品列表/详情、搜索筛选、购物车、下单与订单列表、个人中心（地址管理、资料修改）。
- 管理端：仪表盘、商品 CRUD、订单管理、用户管理。
- 非功能：本地运行零服务器依赖（SQLite 文件）、账号密码登录、基础可观测性（日志）、组件化 UI。

## 架构与技术决策
- 前端/SSR：Next.js App Router，TypeScript，Tailwind CSS，Shadcn/UI。
- 状态：Zustand（购物车等客户端状态），React Query 可选用于数据请求缓存。
- 后端：Next.js API Routes（或 App Router route handlers）+ Prisma ORM。
- 数据库：SQLite 文件，Prisma Migrate，种子脚本初始化演示数据。
- 认证：NextAuth Credentials Provider，JWT session。
- 资源存储：本地 public/ 下的商品图片。

## 里程碑与任务拆分
1) 项目脚手架（0.5 天）
   - create-next-app 初始化（TS/Tailwind/App Router/src）。
   - 配置别名、ESLint/Prettier，接入 Shadcn/UI。
2) 基础样式与组件（0.5 天）
   - Tailwind 配置、全局布局/导航/页脚；引入 Button/Card/Input/Form/Dialog/Tabs/Toast/Skeleton 等组件。
3) 数据层与种子（1 天）
   - 定义 Prisma schema（用户、商品、购物车、订单、订单项、地址）。
   - 生成迁移与 Prisma Client；seed.ts 播种管理员、示例用户和商品。
4) 认证与用户模型打通（1 天）
   - NextAuth Credentials Provider，登录/注册 API；会话注入用户 id/role；保护路由（middleware/服务器组件鉴权）。
5) 用户端功能（2 天）
   - 商品列表/详情（搜索、分类、分页/无限滚动）。
   - 购物车（Zustand 持久化）、下单流程（地址选择、运费、订单创建）、订单列表/详情。
   - 个人中心（资料修改、地址 CRUD）。
6) 管理端（2 天）
   - 仪表盘（销量/订单/库存概要）。
   - 商品管理 CRUD（含多图上传路径、库存/上下架）。
   - 订单管理（状态流转：pending/paid/shipped/delivered/cancelled）。
   - 用户管理（角色切换、禁用/启用）。
7) 体验与可观测性（0.5 天）
   - Shadcn Toast/Alert，Skeleton/Loading state，表单校验（zod + react-hook-form）。
   - Prisma 日志级别配置，错误边界/全局错误页。
8) 测试与质量（1 天）
   - 单元测试：服务层/数据访问；组件快照/交互测试（React Testing Library）。
   - 简单端到端流（注册→登录→购物→下单）。
9) 打包与运行（0.5 天）
   - 本地构建 `next build` 验证；文档化启动流程与环境变量模板。

## 数据与接口设计要点
- 数据模型：User (role: user/admin)、Product、CartItem、Order、OrderItem、Address。
- 关键 API：/api/auth/login|register、/api/products（列表/搜索/分类）、/api/cart（同步购物车到服务器，可选）、/api/orders（创建/列表/详情/状态变更）、/api/admin/products|orders|users。
- 权限：中间件基于 NextAuth session role 保护 /admin/**；订单/购物车接口绑定 userId。

## UI/UX 规划
- 主题：Tailwind + Shadcn 变量，浅色为主；组件复用（表单、表格、对话框）。
- 列表：商品卡片（价格/原价/折扣/库存/评分），筛选栏（分类、价格区间、排序）。
- 流程：购物车→确认订单→结果页；下单后 Toast + 订单详情链接。
- 管理端：表格 + 分页 + 过滤；状态标签，操作按钮分权限显示。

## 环境与脚本
- Scripts：dev/build/start/lint，`db:seed` 播种，`prisma migrate dev`，`prisma studio` 便捷查看数据。
- Env：NEXTAUTH_SECRET、DATABASE_URL（file:./dev.db）、NEXTAUTH_URL、本地演示账号密码。

## 风险与缓解
- 认证安全：密码哈希（bcrypt），错误信息模糊处理。
- 并发写：订单库存扣减需事务；SQLite 支持事务，Prisma transaction 包装。
- UX 复杂度：确保加载/空态/错误态齐全；Skeleton + Toast。
- 未来扩展：预留 Storage/CDN、支付网关抽象，数据库可平滑换成 Postgres。

## 交付物
- 完整代码仓库，含种子数据和 demo 账号。
- README：启动步骤、账号、脚本清单、主要页面截图。
- 基础测试用例与运行说明。
