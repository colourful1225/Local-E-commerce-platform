import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

function formatDate(value: Date) {
  return value.toLocaleString("zh-CN", { hour12: false });
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/orders/${params.id}`)}`);
  }

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: session.user.id as string },
    include: {
      items: {
        include: { product: true },
      },
      address: true,
    },
  });

  if (!order) {
    notFound();
  }

  const totalAmount = formatCurrency(order.total + order.shippingFee);
  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Order</p>
          <h1 className="text-3xl font-semibold">订单详情</h1>
          <p className="text-slate-600">订单号：{order.id}</p>
        </div>
        <Badge variant="secondary">{order.status}</Badge>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>概要</CardTitle>
          <CardDescription>{formatDate(order.createdAt)}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
          <div>商品件数：{itemCount}</div>
          <div>合计金额：{totalAmount}</div>
          <div>运费：{formatCurrency(order.shippingFee)}</div>
          <div className="sm:col-span-3">
            配送地址：
            <span className="ml-2 text-slate-600">
              {order.address?.name}，{order.address?.phone}，{order.address?.province}
              {order.address?.city}
              {order.address?.district} {order.address?.detail}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>商品明细</CardTitle>
          <CardDescription>合计 {itemCount} 件</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>商品</TableHead>
                <TableHead>单价</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>小计</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-xs">
                    <div className="font-medium text-slate-900">{item.product.name}</div>
                    <div className="text-sm text-slate-600">{item.product.description}</div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/orders">返回订单列表</Link>
        </Button>
        <Button asChild>
          <Link href="/products">继续购物</Link>
        </Button>
      </div>
    </div>
  );
}
