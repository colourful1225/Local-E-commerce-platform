import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Cart</p>
        <h1 className="text-3xl font-semibold">购物车</h1>
        <p className="text-slate-600">当前为演示占位，后续接入 Zustand/Prisma 的真实数据。</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>购物车为空</CardTitle>
          <CardDescription>添加商品后，可在此查看明细与结算。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Separator />
          <div className="flex gap-3">
            <Button>去逛逛</Button>
            <Button variant="outline">查看订单</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
