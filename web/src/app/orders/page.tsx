import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

function formatDate(value: Date) {
  return value.toLocaleString("zh-CN", { hour12: false });
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/orders")}`);
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Orders</p>
          <h1 className="text-3xl font-semibold">我的订单</h1>
          <p className="text-slate-600">查看下单记录与状态。</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">继续购物</Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>暂无订单</CardTitle>
            <CardDescription>去挑选商品，下单后可在此查看详情。</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/products">前往商品</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const amount = formatCurrency(order.total + order.shippingFee);
            const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

            return (
              <Card key={order.id} className="border-slate-200">
                <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>订单号：{order.id}</CardTitle>
                    <CardDescription>{formatDate(order.createdAt)}</CardDescription>
                  </div>
                  <Badge variant="secondary">{order.status}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                    <div>商品件数：{itemCount}</div>
                    <div>金额合计：{amount}</div>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span className="line-clamp-1">{item.product.name}</span>
                        <span>
                          x{item.quantity} · {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 ? (
                      <div className="text-slate-500">... 还有 {order.items.length - 3} 项</div>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link href={`/orders/${order.id}`}>查看详情</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/products">再买一单</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
