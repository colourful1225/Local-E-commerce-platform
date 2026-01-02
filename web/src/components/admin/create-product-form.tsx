"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export function CreateProductForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: "",
    featured: false,
  });

  const handleChange = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.description) {
      toast.error("请填写必填项");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock || "0");
    if (Number.isNaN(price) || price <= 0) {
      toast.error("价格需为正数");
      return;
    }
    if (Number.isNaN(stock) || stock < 0) {
      toast.error("库存需为非负整数");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price,
          stock,
          category: form.category,
          description: form.description,
          images: form.images
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
          featured: form.featured,
        }),
      });

      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        toast.error(data?.message || "创建失败");
        return;
      }

      toast.success("创建成功");
      setForm({ name: "", price: "", stock: "", category: "", description: "", images: "", featured: false });
      router.refresh();
    } catch (error) {
      toast.error("创建失败，请稍后重试");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 text-sm sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-wrap gap-3">
        <div className="min-w-[140px] space-y-1">
          <Label htmlFor="name">名称</Label>
          <Input id="name" value={form.name} onChange={handleChange("name")} required />
        </div>
        <div className="min-w-[120px] space-y-1">
          <Label htmlFor="price">价格</Label>
          <Input id="price" type="number" value={form.price} onChange={handleChange("price")} required />
        </div>
        <div className="min-w-[100px] space-y-1">
          <Label htmlFor="stock">库存</Label>
          <Input id="stock" type="number" value={form.stock} onChange={handleChange("stock")} />
        </div>
        <div className="min-w-[140px] space-y-1">
          <Label htmlFor="category">分类</Label>
          <Input id="category" value={form.category} onChange={handleChange("category")} required />
        </div>
        <div className="min-w-[200px] space-y-1">
          <Label htmlFor="images">图片（逗号分隔）</Label>
          <Input
            id="images"
            placeholder="/p/1.jpg, /p/2.jpg"
            value={form.images}
            onChange={handleChange("images")}
          />
        </div>
        <div className="min-w-[240px] flex-1 space-y-1">
          <Label htmlFor="description">描述</Label>
          <Textarea id="description" rows={2} value={form.description} onChange={handleChange("description")} />
        </div>
        <label className="flex items-center gap-2 pt-6 text-sm text-slate-700">
          <input
            id="featured"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          精选
        </label>
      </div>
      <Button type="submit" disabled={loading} className="sm:self-end">
        {loading ? "创建中..." : "新增商品"}
      </Button>
    </form>
  );
}
