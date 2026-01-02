"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseImageUrls } from "@/lib/utils";

export function ProductRowActions({ product }: { product: Product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [featured, setFeatured] = useState(product.featured);
  const [images, setImages] = useState(parseImageUrls(product.images).join(", "));

  const handleUpdate = async () => {
    const priceNum = Number(price);
    const stockNum = Number(stock);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("价格需为正数");
      return;
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
      toast.error("库存需为非负整数");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: priceNum,
          stock: stockNum,
          featured,
          images: images
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        }),
      });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        toast.error(data?.message || "更新失败");
        return;
      }
      toast.success("已更新");
      router.refresh();
    } catch (error) {
      toast.error("更新失败，请稍后重试");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确认删除该商品？")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) {
        toast.error(data?.message || "删除失败");
        return;
      }
      toast.success("已删除");
      router.refresh();
    } catch (error) {
      toast.error("删除失败，请稍后重试");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2 text-sm">
      <div className="flex flex-wrap items-center gap-2 justify-end">
        <Input
          className="w-24"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          aria-label="price"
        />
        <Input
          className="w-20"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          aria-label="stock"
        />
        <label className="flex items-center gap-1 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          精选
        </label>
        <Input
          className="w-48"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="图片列表"
          aria-label="images"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleUpdate} disabled={loading}>
          更新
        </Button>
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading}>
          删除
        </Button>
      </div>
    </div>
  );
}
