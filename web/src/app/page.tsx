import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const featured = [
  {
    name: "iPhone 15 Pro",
    price: "¥7,999",
    tagline: "A17 Pro · 钛金属机身",
  },
  {
    name: "MacBook Pro 14",
    price: "¥14,999",
    tagline: "M3 Pro · Liquid Retina XDR",
  },
  {
    name: "AirPods Pro 2",
    price: "¥1,899",
    tagline: "自适应降噪 · 空间音频",
  },
];

const highlights = [
  {
    title: "本地优先",
    desc: "SQLite 持久化，无需云端依赖，开箱即用。",
  },
  {
    title: "全栈一体",
    desc: "Next.js App Router + Prisma + NextAuth，前后端同仓。",
  },
  {
    title: "可视化组件",
    desc: "Shadcn/UI + Tailwind，快速搭建后台与用户端。",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:py-20">
        <header className="flex flex-col gap-6 rounded-3xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Badge variant="outline">Local-first</Badge>
            <span>Next.js 14 · TypeScript · Shadcn/UI</span>
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Local E-commerce Platform</p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                本地电商全栈模板，<span className="text-slate-500">即刻可跑</span>
              </h1>
              <p className="text-lg text-slate-600">
                内置认证、数据库、组件库和状态管理，支持本地离线开发与演示，适合快速验证与交付。
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/products">
                <Button size="lg">开始购物体验</Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline">
                  管理端预览
                </Button>
              </Link>
            </div>
          </div>
          <Separator className="my-2" />
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600">{item.desc}</CardContent>
              </Card>
            ))}
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Featured</p>
              <h2 className="text-2xl font-semibold">推荐商品</h2>
            </div>
            <Link href="/products">
              <Button variant="outline" size="sm">
                查看全部
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((product) => (
              <Card key={product.name} className="h-full border-slate-200">
                <CardHeader>
                  <Badge className="w-fit" variant="secondary">
                    热门
                  </Badge>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-slate-600">
                  <p className="text-lg font-semibold text-slate-900">{product.price}</p>
                  <p className="text-sm">{product.tagline}</p>
                  <Button className="w-full" variant="outline">
                    加入购物车
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-slate-900 px-8 py-10 text-white shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Stack</p>
              <h3 className="text-2xl font-semibold">Prisma · NextAuth · Zustand</h3>
              <p className="text-slate-200">
                认证、数据库、状态管理开箱即用，支持本地演示的全链路体验。
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary">查看数据模型</Button>
              <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                查看接口设计
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
