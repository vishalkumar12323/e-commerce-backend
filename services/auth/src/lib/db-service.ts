import { prisma } from "./db-client.js";
import { PrismaClient } from "@prisma/client";
import { TUserProps, TUserSessionProps } from "../types/index.js";
import { hashPass } from "../utils/password-service.js";

class AuthDatabase {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  async createUser(
    userData: TUserProps
  ): Promise<{ id: string; email: string }> {
    const { email, name, password, phone_number } = userData;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("USER_EXISTS");
    }

    const hashedPassword = await hashPass(password);
    return await this.prisma.user.create({
      data: { name, email, password: hashedPassword, phone_number },
      select: { id: true, email: true },
    });
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user) throw new Error("INVALID_CREDENTIALS");
    return user;
  }

  async findUserById(userid: string) {
    return await this.prisma.user.findUnique({
      where: { id: userid },
      select: {
        email: true,
        id: true,
        name: true,
        phone_number: true,
      },
    });
  }

  async findSessionByRefreshToken(refreshToken: string, userId: string) {
    return await this.prisma.session.findFirst({
      where: { refresh_token: refreshToken, userId, is_valid: true },
      select: {
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
  async createUserSession(userId: string, sessionPayload: TUserSessionProps) {
    const { refreshToken, ip_address, user_agent } = sessionPayload;
    await this.prisma.session.create({
      data: {
        userId,
        refresh_token: refreshToken,
        ip_address,
        user_agent,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      },
    });
  }
  async logout(userId: string, refreshToken: string) {
    await this.prisma.session.update({
      where: { userId, refresh_token: refreshToken, is_valid: true },
      data: { is_valid: false },
    });
  }
}

export default AuthDatabase;
