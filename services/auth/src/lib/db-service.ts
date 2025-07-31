import { prisma } from "./db-client.js";
import { PrismaClient } from "@prisma/client";
import { TUserProps, TUserSessionProps } from "../types/index.js";
import { hashPass } from "../utils/password-service.js";
import { getSessionExpiryMs } from "../utils/token-service.js";

class AuthDatabase {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = prisma;
  }

  public async getUsers() {
    return await this.prisma.user.findMany({ omit: { password: true } });
  }
  public async createUser(
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

  public async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });

    if (!user) throw new Error("INVALID_CREDENTIALS");
    return user;
  }

  public async findUserById(userid: string) {
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

  public async findSessionByRefreshToken(refreshToken: string, userId: string) {
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
  public async createUserSession(
    userId: string,
    sessionPayload: TUserSessionProps
  ) {
    const { refreshToken, ip_address, user_agent } = sessionPayload;
    await this.prisma.session.create({
      data: {
        userId,
        refresh_token: refreshToken,
        ip_address,
        user_agent,
        expires_at: new Date(Date.now() + getSessionExpiryMs()),
      },
    });
  }
  public async logout(userId: string, refreshToken: string) {
    await this.prisma.session.update({
      where: { userId, refresh_token: refreshToken, is_valid: true },
      data: { is_valid: false },
    });
  }

  public async updatePassword(userId: string, password: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }

  public async resetPassword(userId: string, token: string, expiresAt: Date) {
    return await this.prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expires_at: expiresAt,
      },
    });
  }
}

export default AuthDatabase;
