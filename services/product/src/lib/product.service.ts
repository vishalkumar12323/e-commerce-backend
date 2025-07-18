import { PrismaClient } from "@prisma/client";
import { prisma } from "./database.js";

class ProductService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async getAllProducts() {
    return await this.prisma.product.findMany();
  }

  async getProductById(productId: string) {
    return this.prisma.product.findUnique({ where: { id: productId } });
  }

  async createProduct(data: any) {
    return this.prisma.product.create({ data });
  }

  async update(productId: string, data: any) {
    return await this.prisma.product.update({ where: { id: productId }, data });
  }

  async delete(productId: string) {
    return this.prisma.product.delete({ where: { id: productId } });
  }
}

export default ProductService;
