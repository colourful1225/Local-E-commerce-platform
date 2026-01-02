import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().trim().min(1, "请输入姓名").max(50).optional(),
  email: z.string().email({ message: "邮箱格式不正确" }),
  password: z.string().min(6, "密码至少 6 位").max(50),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { name, email, password } = registerSchema.parse(json);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "该邮箱已注册" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || email.split("@")[0],
        role: "user",
      },
    });

    return NextResponse.json({ message: "注册成功" }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const message = error.issues[0]?.message || "参数错误";
      return NextResponse.json({ message }, { status: 400 });
    }

    console.error("Register error", error);
    return NextResponse.json({ message: "注册失败" }, { status: 500 });
  }
}
