import { prisma } from "./db-client.js";
import { PrismaClient } from "@prisma/client";

type TUserProps = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
};
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

      const user = await this.prisma.user.create({
        data: { name, email, password, phone_number },
        select: { id: true, email: true },
      });

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof Error && error.message === "USER_EXISTS") {
        throw error;
      }
      throw new Error("Error creating user");
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true },
      });

      if (!user) throw new Error("USER_NOT_FOUND");

      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      if (error instanceof Error && error.message === "USER_NOT_FOUND") {
        throw error;
      }
      throw new Error("Error finding user by email");
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

  async findUserByRefreshToken(refreshToken: string) {
    return await this.prisma.session.findUnique({
      where: { refresh_token: refreshToken },
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
  async createUserSession(userId: string, refreshToken: string) {
    try {
      const existingSession = await this.prisma.session.findFirst({
        where: {
          OR: [{ refresh_token: refreshToken }, { userId }],
        },
      });

      if (existingSession) {
        return await this.prisma.session.update({
          where: { id: existingSession.id },
          data: {
            userId,
            refresh_token: refreshToken,
            expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
          },
        });
      }

      return await this.prisma.session.create({
        data: {
          id: userId,
          refresh_token: refreshToken,
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {}
  }

  async updateUserSession(userId: string, refreshToken: string) {
    try {
      const existingSession = await this.prisma.session.findUnique({
        where: { userId },
      });

      if (!existingSession) {
        return await this.createUserSession(userId, refreshToken);
      }

      await this.prisma.session.update({
        where: { userId },
        data: {
          refresh_token: refreshToken,
          expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        },
      });
    } catch (error) {
      console.error("Error updating user session:", error);
      throw new Error("Error updating user session");
    }
  }

  async logout(userId: string) {
    try {
      await this.prisma.session.delete({
        where: { userId },
      });
    } catch (error) {
      console.error("Error logging out user:", error);
      throw new Error("Error logging out user");
    }
  }
}

export default AuthDatabase;
