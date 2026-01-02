import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { prisma } from "@/lib/db";
import { formatCurrency, parseImageUrls } from "@/lib/utils";

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Catalog</p>
          <h1 className="text-3xl font-semibold">商品列表</h1>
          <p className="text-slate-600">来自数据库的实时商品列表。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">筛选</Button>
          <Button asChild>
            <Link href="/admin">新增商品（Admin）</Link>
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="py-8 text-center text-slate-600">暂无商品，请先在数据库或后台添加。</CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((item) => {
            const images = parseImageUrls(item.images);
            const cover = images[0];

            return (
              <Card key={item.id} className="border-slate-200">
                {cover && (
                  <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-slate-100">
                    <Image
                      src={cover}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      priority
                    />
                  </div>
                )}
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <div className="space-y-1">
                    <CardTitle>{item.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{item.category}</Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-slate-700">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-slate-900">{formatCurrency(item.price)}</div>
                    {item.comparePrice ? (
                      <div className="text-sm text-slate-500 line-through">{formatCurrency(item.comparePrice)}</div>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <AddToCartButton
                      productId={item.id}
                      name={item.name}
                      price={item.price}
                      image={cover}
                    />
                    <Button size="sm" asChild>
                      <Link href={`/products/${item.id}`}>查看详情</Link>
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
