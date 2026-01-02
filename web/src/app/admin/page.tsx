import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const stats = [
  { label: "今日订单", value: "23", hint: "+12%" },
  { label: "库存预警", value: "5", hint: "待补货" },
  { label: "待发货", value: "8", hint: "需要处理" },
];

export default function AdminPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Admin</p>
          <h1 className="text-3xl font-semibold">管理端仪表盘</h1>
          <p className="text-slate-600">演示视图，后续将接入权限、数据统计与 CRUD 界面。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">同步库存</Button>
          <Button>发布新商品</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="border-slate-200">
            <CardHeader className="space-y-1">
              <CardDescription>{item.label}</CardDescription>
              <CardTitle className="text-2xl">{item.value}</CardTitle>
              <Badge variant="secondary">{item.hint}</Badge>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>待办与操作</CardTitle>
          <CardDescription>后续将填充订单、用户、商品的 CRUD 面板。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline">查看订单</Button>
            <Button variant="outline">用户管理</Button>
            <Button variant="outline">商品管理</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
