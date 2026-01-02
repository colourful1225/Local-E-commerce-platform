import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "至少添加一件商品"),
});

async function ensureAddress(tx: Prisma.TransactionClient, userId: string, name?: string | null) {
  const existing = await tx.address.findFirst({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  if (existing) return existing;

  return tx.address.create({
    data: {
      userId,
      name: name || "用户",
      phone: "未填写",
      province: "",
      city: "",
      district: "",
      detail: "待填写",
      isDefault: true,
    },
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }

  const parseResult = createOrderSchema.safeParse(await req.json());
  if (!parseResult.success) {
    const message = parseResult.error.issues[0]?.message || "请求参数错误";
    return NextResponse.json({ message }, { status: 400 });
  }

  const userId = session.user.id as string;
  const items = parseResult.data.items;
  const productIds = items.map((i) => i.productId);

  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  if (productIds.length !== products.length) {
    return NextResponse.json({ message: "部分商品不存在" }, { status: 400 });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        const product = productMap.get(item.productId)!;
        if (product.stock < item.quantity) {
          throw new Error(`库存不足: ${product.name}`);
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const address = await ensureAddress(tx, userId, session.user.name);

      const total = items.reduce((acc, item) => {
        const product = productMap.get(item.productId)!;
        return acc + product.price * item.quantity;
      }, 0);

      const created = await tx.order.create({
        data: {
          userId,
          status: "pending",
          total,
          shippingFee: 0,
          addressId: address.id,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)!.price,
            })),
          },
        },
        select: { id: true },
      });

      return created;
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "下单失败";
    const status = message.startsWith("库存不足") ? 400 : 500;
    return NextResponse.json({ message }, { status });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "未登录" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      address: true,
    },
  });

  return NextResponse.json({ orders });
}
