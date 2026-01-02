import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { prisma } from "@/lib/db";
import { formatCurrency, parseImageUrls } from "@/lib/utils";

async function getProduct(id: string) {
  return prisma.product.findUnique({ where: { id } });
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const images = parseImageUrls(product.images);
  const cover = images[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Product</p>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-slate-600">{product.description}</p>
          <div className="flex gap-2 text-sm text-slate-500">
            <span>分类：{product.category}</span>
            {product.brand ? <span>| 品牌：{product.brand}</span> : null}
            <span>| 库存：{product.stock}</span>
          </div>
        </div>
        <Badge variant={product.featured ? "default" : "secondary"}>
          {product.featured ? "精选" : "在售"}
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          {cover ? (
            <div className="relative h-[360px] w-full overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={cover}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
              />
            </div>
          ) : (
            <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-200 text-slate-400">
              暂无图片
            </div>
          )}

          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img} className="relative h-20 overflow-hidden rounded-lg border border-slate-200">
                  <Image src={img} alt={product.name} fill className="object-cover" sizes="200px" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl">{formatCurrency(product.price)}</CardTitle>
            <CardDescription>
              {product.comparePrice ? (
                <span className="text-slate-500 line-through">{formatCurrency(product.comparePrice)}</span>
              ) : (
                <span className="text-slate-500">含基础保修</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Badge variant="secondary">评分 {product.rating.toFixed(1)} / 5</Badge>
              <span>共 {product.reviewCount} 条评价</span>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <p>支持本地自提或快递，运费待下单计算。</p>
              <p>下单后可在订单详情查看物流与状态。</p>
            </div>
            <div className="flex gap-2">
              <AddToCartButton
                productId={product.id}
                name={product.name}
                price={product.price}
                image={cover}
                disabled={product.stock <= 0}
              />
              <Button variant="outline" className="flex-1" disabled>
                立即购买（开发中）
              </Button>
            </div>
            <div className="text-sm text-slate-500">
              需要管理员修改库存或价格？前往
              <Link className="ml-1 underline" href="/admin">
                管理端
              </Link>
              。
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
