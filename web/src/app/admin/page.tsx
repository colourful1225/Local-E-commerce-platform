import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateProductForm } from "@/components/admin/create-product-form";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getDashboardData() {
  const [orderCount, productCount, lowStockCount, amountAgg, products, orders, users] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
    prisma.order.aggregate({ _sum: { total: true, shippingFee: true } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: true,
      },
    }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const totalAmount = (amountAgg._sum.total || 0) + (amountAgg._sum.shippingFee || 0);

  return { orderCount, productCount, lowStockCount, totalAmount, products, orders, users };
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") {
    redirect("/");
  }

  const { orderCount, productCount, lowStockCount, totalAmount, products, orders, users } =
    await getDashboardData();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Admin</p>
          <h1 className="text-3xl font-semibold">管理端</h1>
          <p className="text-slate-600">商品、订单与用户管理，需管理员权限。</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/">返回前台</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200">
          <CardHeader className="space-y-1">
            <CardDescription>订单数</CardDescription>
            <CardTitle className="text-2xl">{orderCount}</CardTitle>
            <Badge variant="secondary">近 20 条统计</Badge>
          </CardHeader>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="space-y-1">
            <CardDescription>GMV（含运费）</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalAmount)}</CardTitle>
            <Badge variant="secondary">累计</Badge>
          </CardHeader>
        </Card>
        <Card className="border-slate-200">
          <CardHeader className="space-y-1">
            <CardDescription>库存预警 (&lt;5)</CardDescription>
            <CardTitle className="text-2xl">{lowStockCount}</CardTitle>
            <Badge variant="secondary">共 {productCount} 件商品</Badge>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>商品管理</CardTitle>
            <CardDescription>新增、编辑或删除商品（多图 JSON，支持标记精选）。</CardDescription>
          </div>
          <CreateProductForm />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>库存</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>精选</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Badge variant={product.featured ? "default" : "outline"}>
                        {product.featured ? "精选" : "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ProductRowActions product={product} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>订单管理</CardTitle>
          <CardDescription>近 10 条订单，可更新状态。</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.user?.email || "-"}</TableCell>
                  <TableCell>{formatCurrency(order.total + order.shippingFee)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <OrderStatusSelect orderId={order.id} current={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>用户管理</CardTitle>
          <CardDescription>切换角色或禁用用户，至少保留一名活跃管理员。</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>邮箱</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.active ? "secondary" : "outline"}>{user.active ? "active" : "disabled"}</Badge>
                  </TableCell>
                  <TableCell>
                    <UserRowActions user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
