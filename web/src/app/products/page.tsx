import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const products = [
  {
    name: "iPhone 15 Pro",
    price: "¥7,999",
    category: "手机",
    desc: "A17 Pro · 钛金属机身",
  },
  {
    name: "MacBook Pro 14",
    price: "¥14,999",
    category: "电脑",
    desc: "M3 Pro · Liquid Retina XDR",
  },
  {
    name: "AirPods Pro 2",
    price: "¥1,899",
    category: "耳机",
    desc: "自适应降噪 · 空间音频",
  },
  {
    name: "Apple Watch Series 9",
    price: "¥2,999",
    category: "手表",
    desc: "始终显示屏 · 健康监测",
  },
];

export default function ProductsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Catalog</p>
          <h1 className="text-3xl font-semibold">商品列表</h1>
          <p className="text-slate-600">演示数据，后续将接入数据库查询与筛选。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">筛选</Button>
          <Button>新增商品（Admin）</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {products.map((item) => (
          <Card key={item.name} className="border-slate-200">
            <CardHeader className="flex flex-row items-start justify-between gap-2">
              <div className="space-y-1">
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </div>
              <Badge variant="secondary">{item.category}</Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-slate-700">
              <div className="text-lg font-semibold text-slate-900">{item.price}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  加入购物车
                </Button>
                <Button size="sm">查看详情</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
