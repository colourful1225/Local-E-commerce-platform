import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Auth</p>
        <h1 className="text-3xl font-semibold">注册</h1>
        <p className="text-slate-600">演示表单，后续将对接注册 API 并自动登录。</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>创建账号</CardTitle>
          <CardDescription>当前为占位 UI，将调用 Prisma/NextAuth 完成注册。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" placeholder="张三" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" placeholder="至少 6 位" />
          </div>
          <Button className="w-full" disabled>
            注册（待接入）
          </Button>
          <div className="text-sm text-slate-600">
            已有账号？
            <Link className="ml-2 text-slate-900 underline" href="/login">
              去登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
