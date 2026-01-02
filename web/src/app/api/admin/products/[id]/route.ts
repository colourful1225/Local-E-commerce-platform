import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  comparePrice: z.number().positive().nullable().optional(),
  category: z.string().min(1).optional(),
  brand: z.string().nullable().optional(),
  images: z.array(z.string().min(1)).optional(),
  stock: z.number().int().nonnegative().optional(),
  featured: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const json = await req.json();
  const parse = updateSchema.safeParse(json);
  if (!parse.success) {
    const message = parse.error.issues[0]?.message || "参数错误";
    return NextResponse.json({ message }, { status: 400 });
  }

  const data = parse.data;

  try {
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...("name" in data ? { name: data.name } : {}),
        ...("description" in data ? { description: data.description } : {}),
        ...("price" in data ? { price: data.price } : {}),
        ...("comparePrice" in data ? { comparePrice: data.comparePrice ?? null } : {}),
        ...("category" in data ? { category: data.category } : {}),
        ...("brand" in data ? { brand: data.brand ?? null } : {}),
        ...("images" in data ? { images: JSON.stringify(data.images) } : {}),
        ...("stock" in data ? { stock: data.stock } : {}),
        ...("featured" in data ? { featured: data.featured } : {}),
      },
    });

    return NextResponse.json({ product: updated });
  } catch (error) {
    return NextResponse.json({ message: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: "删除失败" }, { status: 500 });
  }
}
