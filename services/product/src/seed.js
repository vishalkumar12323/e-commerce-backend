import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
const main = async () => {
  const category = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: {
      name: "Electronics",
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Smartphone X",
        description: "Latest model smartphone",
        price: 799.99,
        sku: "SPX-001",
        categoryId: category.id,
      },
      {
        name: "Wireless Headphones",
        description: "Noise-cancelling headphones",
        price: 265.65,
        sku: "WH-002",
        categoryId: category.id,
      },
      {
        name: "Smartwatch Pro",
        description: "Waterproof smartwatch with GPS",
        price: 519.9,
        sku: "SWP-003",
        categoryId: category.id,
      },
    ],
  });
};

main()
  .then(() => {
    console.log("success!");
    return prisma.$disconnect();
  })
  .catch((err) => {
    console.log("err ", err);
    return prisma.$disconnect();
  });
