"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { selectCartTotals, useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clear = useCartStore((state) => state.clear);

  const { totalAmount, totalQuantity } = selectCartTotals(items);

  const handleCheckout = async () => {
    if (!items.length) {
      toast.error("购物车为空");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        }),
      });

      if (res.status === 401) {
        toast.error("请先登录");
        router.push(`/login?callbackUrl=${encodeURIComponent("/cart")}`);
        return;
      }

      const data = (await res.json().catch(() => null)) as { orderId?: string; message?: string } | null;

      if (!res.ok) {
        toast.error(data?.message || "下单失败");
        return;
      }

      toast.success("下单成功");
      clear();
      if (data?.orderId) {
        router.push(`/orders/${data.orderId}`);
      } else {
        router.push("/orders");
      }
    } catch (error) {
      console.error("Checkout error", error);
      toast.error("下单失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const emptyState = (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>购物车为空</CardTitle>
        <CardDescription>添加商品后，可在此查看明细与结算。</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Separator />
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/products">去逛逛</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/orders">查看订单</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Cart</p>
        <h1 className="text-3xl font-semibold">购物车</h1>
        <p className="text-slate-600">支持本地持久化，结算需登录。</p>
      </div>

      {items.length === 0 ? (
        emptyState
      ) : (
        <Card className="border-slate-200">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>购物车明细</CardTitle>
              <CardDescription>共 {totalQuantity} 件，合计 {formatCurrency(totalAmount)}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={clear}>
              清空购物车
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-base font-semibold text-slate-900">{item.name}</div>
                    <div className="text-sm text-slate-600">单价 {formatCurrency(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>数量</span>
                      <Input
                        type="number"
                        min={1}
                        className="w-20"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, Number(e.target.value) || 1)}
                      />
                    </div>
                    <div className="text-base font-semibold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                    >
                      移除
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-600">
                共 {totalQuantity} 件，合计
                <span className="ml-2 text-lg font-semibold text-slate-900">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/products">继续购物</Link>
                </Button>
                <Button onClick={handleCheckout} disabled={loading}>
                  {loading ? "下单中..." : "下单"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
