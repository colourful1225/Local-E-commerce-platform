import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

const statusSchema = z.object({
  status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const json = await req.json();
  const parse = statusSchema.safeParse(json);
  if (!parse.success) {
    const message = parse.error.issues[0]?.message || "参数错误";
    return NextResponse.json({ message }, { status: 400 });
  }

  try {
    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status: parse.data.status },
      select: { id: true, status: true },
    });
    return NextResponse.json({ order: updated });
  } catch (error) {
    return NextResponse.json({ message: "更新失败" }, { status: 500 });
  }
}
