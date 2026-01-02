"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function NavAuthActions() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm text-slate-400">加载中...</div>;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/login">登录</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">注册</Link>
        </Button>
      </div>
    );
  }

  const name = session.user.name || session.user.email || "用户";
  const initial = name.slice(0, 1).toUpperCase();
  const roleLabel = (session.user as any).role === "admin" ? "管理员" : "用户";

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-slate-500">{roleLabel}</div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        退出
      </Button>
    </div>
  );
}
