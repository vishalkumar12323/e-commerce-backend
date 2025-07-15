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
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("USER_EXISTS");
      }

      const hashedPassword = await hashPass(password);
      const user = await this.prisma.user.create({
        data: { name, email, password: hashedPassword, phone_number },
        select: { id: true, email: true },
      });

      return user;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal server error."
      );
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true },
      });

      if (!user) throw new Error("INVALID_CREDENTIALS");
      return user;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal server error."
      );
    }
  }

  async findUserById(userid: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { id: userid },
        select: {
          email: true,
          id: true,
          name: true,
          phone_number: true,
        },
      });
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Error finding user by ID");
    }
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
    try {
      await this.prisma.session.create({
        data: {
          userId,
          refresh_token: refreshToken,
          ip_address,
          user_agent,
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        },
      });
    } catch (error) {
      console.log("errr: ", error);
    }
  }
  async logout(userId: string, refreshToken: string) {
    try {
      await this.prisma.session.update({
        where: { userId, refresh_token: refreshToken, is_valid: true },
        data: { is_valid: false },
      });
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal server error."
      );
    }
  }
}

export default AuthDatabase;
