import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireAdmin(): Promise<{ session?: Session; error?: NextResponse }> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: NextResponse.json({ message: "未登录" }, { status: 401 }) };
  }

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id as string } });

  if (!dbUser || dbUser.role !== "admin" || !dbUser.active) {
    return { error: NextResponse.json({ message: "未授权" }, { status: 403 }) };
  }

  return { session };
}
