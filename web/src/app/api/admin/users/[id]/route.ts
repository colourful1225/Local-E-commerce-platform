import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";

const updateSchema = z.object({
  role: z.enum(["user", "admin"]).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;
  const adminSession = guard.session!;

  const json = await req.json();
  const parse = updateSchema.safeParse(json);
  if (!parse.success) {
    const message = parse.error.issues[0]?.message || "参数错误";
    return NextResponse.json({ message }, { status: 400 });
  }

  const payload = parse.data;

  if (!payload.role && typeof payload.active === "undefined") {
    return NextResponse.json({ message: "无更新字段" }, { status: 400 });
  }

  if (params.id === (adminSession.user as any).id) {
    if (payload.role && payload.role !== "admin") {
      return NextResponse.json({ message: "不能修改自己的管理员角色" }, { status: 400 });
    }
    if (payload.active === false) {
      return NextResponse.json({ message: "不能禁用自己" }, { status: 400 });
    }
  }

  if ((payload.role && payload.role !== "admin") || payload.active === false) {
    const otherAdmins = await prisma.user.count({
      where: { role: "admin", active: true, id: { not: params.id } },
    });
    if (otherAdmins === 0) {
      return NextResponse.json({ message: "至少保留一名活跃管理员" }, { status: 400 });
    }
  }

  try {
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...("role" in payload ? { role: payload.role } : {}),
        ...("active" in payload ? { active: payload.active } : {}),
      },
      select: { id: true, role: true, active: true, email: true, name: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    return NextResponse.json({ message: "更新失败" }, { status: 500 });
  }
}
