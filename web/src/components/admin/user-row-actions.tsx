"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roles = ["user", "admin"] as const;

type Props = {
  user: Pick<User, "id" | "email" | "name" | "role" | "active">;
};

export function UserRowActions({ user }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<User["role"]>(user.role);
  const [active, setActive] = useState<boolean>(user.active);
  const [loading, setLoading] = useState(false);

  const patchUser = async (payload: { role?: User["role"]; active?: boolean }) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        toast.error(data?.message || "更新失败");
        return false;
      }
      toast.success("已更新");
      router.refresh();
      return true;
    } catch (error) {
      toast.error("更新失败，请稍后重试");
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onRoleChange = async (value: User["role"]) => {
    setRole(value);
    const ok = await patchUser({ role: value });
    if (!ok) setRole(user.role);
  };

  const onActiveToggle = async (next: boolean) => {
    setActive(next);
    const ok = await patchUser({ active: next });
    if (!ok) setActive(user.active);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Select value={role} onValueChange={(v) => onRoleChange(v as User["role"]) } disabled={loading}>
        <SelectTrigger className="w-28">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {roles.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <label className="flex items-center gap-1 text-xs text-slate-600">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-slate-300"
          checked={active}
          onChange={(e) => onActiveToggle(e.target.checked)}
          disabled={loading}
        />
        启用
      </label>
      <Button size="sm" variant="outline" onClick={() => router.refresh()} disabled={loading}>
        刷新
      </Button>
    </div>
  );
}
