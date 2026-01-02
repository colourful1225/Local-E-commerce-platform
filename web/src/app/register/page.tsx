"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().trim().min(1, "请输入姓名").max(50),
  email: z.string().email({ message: "邮箱格式不正确" }),
  password: z.string().min(6, "密码至少 6 位").max(50),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        toast.error(data?.message || "注册失败");
        return;
      }

      toast.success("注册成功，正在登录...");

      const loginRes = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (loginRes?.error) {
        toast.error("注册成功，但自动登录失败，请手动登录");
        router.push("/login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("注册失败，请稍后重试");
      console.error("Register error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Auth</p>
        <h1 className="text-3xl font-semibold">注册</h1>
        <p className="text-slate-600">创建新账号，注册后自动登录。</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>创建账号</CardTitle>
          <CardDescription>填写邮箱与密码，自动生成用户数据。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名</FormLabel>
                    <FormControl>
                      <Input placeholder="张三" autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="至少 6 位"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "注册中..." : "注册并登录"}
              </Button>
            </form>
          </Form>

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
