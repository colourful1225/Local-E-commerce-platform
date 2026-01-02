"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

type Props = {
  orderId: string;
  current: string;
};

export function OrderStatusSelect({ orderId, current }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [loading, setLoading] = useState(false);

  const handleChange = async (next: string) => {
    setValue(next);
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        toast.error(data?.message || "更新失败");
        setValue(current);
        return;
      }
      toast.success("状态已更新");
      router.refresh();
    } catch (error) {
      toast.error("更新失败，请稍后重试");
      console.error(error);
      setValue(current);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
