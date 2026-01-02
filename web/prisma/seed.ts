import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: adminPassword,
      name: "管理员",
      role: "admin",
      active: true,
    },
  });
  console.log("✅ Created admin:", admin.email);

  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: userPassword,
      name: "张三",
      role: "user",
      active: true,
    },
  });
  console.log("✅ Created user:", user.email);

  const products = [
    {
      name: "iPhone 15 Pro",
      description: "A17 Pro 芯片，钛金属设计，Pro 级摄像头系统",
      price: 7999,
      comparePrice: 8999,
      category: "手机",
      brand: "Apple",
      images: JSON.stringify([
        "/products/iphone-15-pro-1.jpg",
        "/products/iphone-15-pro-2.jpg",
      ]),
      stock: 50,
      rating: 4.8,
      reviewCount: 328,
      featured: true,
    },
    {
      name: "MacBook Pro 14\"",
      description: "M3 Pro 芯片，14.2 英寸 Liquid Retina XDR 显示屏",
      price: 14999,
      comparePrice: 16999,
      category: "电脑",
      brand: "Apple",
      images: JSON.stringify([
        "/products/macbook-pro-1.jpg",
        "/products/macbook-pro-2.jpg",
      ]),
      stock: 30,
      rating: 4.9,
      reviewCount: 156,
      featured: true,
    },
    {
      name: "AirPods Pro 2",
      description: "主动降噪，自适应透明模式，空间音频",
      price: 1899,
      comparePrice: 2099,
      category: "耳机",
      brand: "Apple",
      images: JSON.stringify([
        "/products/airpods-pro-1.jpg",
        "/products/airpods-pro-2.jpg",
      ]),
      stock: 100,
      rating: 4.7,
      reviewCount: 892,
      featured: false,
    },
    {
      name: "iPad Air",
      description: "M1 芯片，10.9 英寸 Liquid Retina 显示屏",
      price: 4799,
      comparePrice: null,
      category: "平板",
      brand: "Apple",
      images: JSON.stringify([
        "/products/ipad-air-1.jpg",
        "/products/ipad-air-2.jpg",
      ]),
      stock: 40,
      rating: 4.6,
      reviewCount: 234,
      featured: false,
    },
    {
      name: "Apple Watch Series 9",
      description: "S9 芯片，始终显示视网膜显示屏",
      price: 2999,
      comparePrice: 3299,
      category: "手表",
      brand: "Apple",
      images: JSON.stringify([
        "/products/apple-watch-1.jpg",
        "/products/apple-watch-2.jpg",
      ]),
      stock: 60,
      rating: 4.5,
      reviewCount: 445,
      featured: true,
    },
    {
      name: "Magic Keyboard",
      description: "无线蓝牙键盘，内置可充电电池",
      price: 799,
      comparePrice: null,
      category: "配件",
      brand: "Apple",
      images: JSON.stringify([
        "/products/magic-keyboard-1.jpg",
      ]),
      stock: 150,
      rating: 4.4,
      reviewCount: 567,
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ Created ${products.length} products`);

  await prisma.address.create({
    data: {
      userId: user.id,
      name: "张三",
      phone: "13800138000",
      province: "北京市",
      city: "北京市",
      district: "朝阳区",
      detail: "某某街道某某小区 1 号楼 101",
      isDefault: true,
    },
  });
  console.log("✅ Created address");

  console.log("✨ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
