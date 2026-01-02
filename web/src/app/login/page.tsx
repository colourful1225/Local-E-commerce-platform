"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email({ message: "邮箱格式不正确" }),
  password: z.string().min(6, "密码至少 6 位"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      setLoading(true);
      const callbackUrl = searchParams.get("callbackUrl") || "/";
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (res?.error) {
        toast.error(res.error || "登录失败");
        return;
      }

      toast.success("登录成功");
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      toast.error("登录失败，请稍后重试");
      console.error("Login error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Auth</p>
        <h1 className="text-3xl font-semibold">登录</h1>
        <p className="text-slate-600">使用邮箱与密码登录，支持演示账号。</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>账号密码登录</CardTitle>
          <CardDescription>演示：admin@example.com / admin123；user@example.com / user123</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>
          </Form>

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
