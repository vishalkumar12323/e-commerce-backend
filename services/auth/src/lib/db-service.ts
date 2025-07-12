import { prisma } from "./db-client";
import { PrismaClient } from "@prisma/client";

class AuthDatabase {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async createUser() {}

  async findUserByEmail() {}
}
