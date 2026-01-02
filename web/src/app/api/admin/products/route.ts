import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional().nullable(),
  category: z.string().min(1),
  brand: z.string().optional().nullable(),
  images: z.array(z.string().min(1)).default([]),
  stock: z.number().int().nonnegative(),
  featured: z.boolean().optional().default(false),
});

export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const json = await req.json();
  const parse = productSchema.safeParse(json);
  if (!parse.success) {
    const message = parse.error.issues[0]?.message || "参数错误";
    return NextResponse.json({ message }, { status: 400 });
  }

  const data = parse.data;

  const created = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      comparePrice: data.comparePrice ?? null,
      category: data.category,
      brand: data.brand ?? null,
      images: JSON.stringify(data.images),
      stock: data.stock,
      featured: data.featured,
    },
  });

  return NextResponse.json({ product: created }, { status: 201 });
}
