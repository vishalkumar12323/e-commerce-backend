import AuthDatabase from "../lib/db-service.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  generateRandomToken,
} from "../utils/token-service.js";
import { comparePass, hashPass } from "../utils/password-service.js";
import { TTokenPayload, TUserCredentials, TUserProps } from "../types/index.js";

class AuthService {
  private db: AuthDatabase;
  constructor() {
    this.db = new AuthDatabase();
  }

  public async users() {
    return await this.db.getUsers();
  }
  public async signup(
    userData: TUserProps,
    { ip_address, user_agent }: { ip_address: string; user_agent: string }
  ) {
    try {
      const user = await this.db.createUser(userData);
      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      await this.db.createUserSession(user.id, {
        refreshToken,
        ip_address,
        user_agent,
      });
      return { accessToken, refreshToken, user };
    } catch (error) {
      console.log("Method Signup: ", error);
      throw new Error(
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  }

  public async signin(
    credentials: TUserCredentials,
    { ip_address, user_agent }: { ip_address: string; user_agent: string }
  ) {
    const { email, password } = credentials;

    try {
      const user = await this.db.findUserByEmail(email);

      if (!user) throw new Error("USER_NOT_FOUND");

      if (!(await comparePass(password, user.password))) {
        throw new Error("INVALID_CREDENTIALS");
      }

      const accessToken = createAccessToken({ id: user.id, email: user.email });
      const refreshToken = createRefreshToken({
        id: user.id,
        email: user.email,
      });

      await this.db.createUserSession(user.id, {
        refreshToken,
        ip_address,
        user_agent,
      });
      return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email },
      };
    } catch (error) {
      console.log("Method Signin ", error);
      throw new Error(
        error instanceof Error ? error.message : "Internal server error."
      );
    }
  }

  public async getUserProfile(userId: string) {
    return await this.db.findUserById(userId);
  }

  public async refreshSession(user: TTokenPayload, refreshToken: string) {
    try {
      const session = await this.db.findSessionByRefreshToken(
        refreshToken,
        user.id
      );
      if (!session) throw new Error("INVALID_SESSION");
      const newAccessToken = createAccessToken({
        id: user.id,
        email: user.email,
      });
      return newAccessToken;
    } catch (error) {
      console.log("err:? ", error);
      throw new Error(
        error instanceof Error ? error.message : "Internal server error."
      );
    }
  }

  public async logout(refreshToken: string) {
    try {
      const palyload = verifyRefreshToken(refreshToken) as TTokenPayload;
      await this.db.logout(palyload.id, refreshToken);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal server error."
      );
    }
  }

  public async changePassword(
    userEmail: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const user = await this.db.findUserByEmail(userEmail);

      if (!user) throw new Error("USER_NOT_FOUND");
      if (!(await comparePass(oldPassword, user?.password as string))) {
        throw new Error("INVALID_PASSWORD");
      }

      const newHashedPass = await hashPass(newPassword);
      await this.db.updatePassword(user?.id as string, newHashedPass);
    } catch (error) {
      console.log("Method changePassword: ", error);
      throw new Error(
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  }

  public async forgotPassword(email: string) {
    try {
      const user = await this.db.findUserByEmail(email);

      if (!user) throw new Error("USER_NOT_FOUND");

      const token = generateRandomToken({ id: user.id }, "10m");
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await this.db.resetPassword(user.id, token, expiresAt);

      return { token, userEmail: user.email, name: user.name };
    } catch (error) {
      console.log("Method forgotPassword: ", error);
      throw new Error(
        error instanceof Error ? error.message : "Internal server error."
      );
    }
  }
}

export default AuthService;
