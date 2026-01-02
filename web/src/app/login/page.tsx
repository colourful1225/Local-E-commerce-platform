import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Auth</p>
        <h1 className="text-3xl font-semibold">登录</h1>
        <p className="text-slate-600">演示表单，占位后续将对接 NextAuth Credentials。</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>账号密码登录</CardTitle>
          <CardDescription>示例账号：admin@example.com / admin123；user@example.com / user123</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full" disabled>
            登录（待接入）
          </Button>
          <p className="text-sm text-slate-500">
            暂未接入提交逻辑，后续会调用 NextAuth Credentials API。
          </p>
          <div className="text-sm text-slate-600">
            没有账号？
            <Link className="ml-2 text-slate-900 underline" href="/register">
              去注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
