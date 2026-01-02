"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

type Props = {
  productId: string;
  name: string;
  price: number;
  image?: string | null;
  disabled?: boolean;
};

export function AddToCartButton({ productId, name, price, image, disabled }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({ productId, name, price, image });
    toast.success("已加入购物车");
  };

  return (
    <Button size="sm" variant="outline" onClick={handleAdd} disabled={disabled}>
      加入购物车
    </Button>
  );
}
