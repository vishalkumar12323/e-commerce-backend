import AuthDatabase from "../lib/db-service.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
} from "../utils/token-service.js";
import { comparePass } from "../utils/password-service.js";
import {
  TUserCredentials,
  TUserProps,
  TUserSessionProps,
} from "../types/index.js";

class AuthService {
  private db: AuthDatabase;
  constructor() {
    this.db = new AuthDatabase();
  }

  async signup(
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
      throw new Error(
        error instanceof Error ? error.message : "Internal server error"
      );
    }
  }

  async signin(
    credentials: TUserCredentials,
    { ip_address, user_agent }: { ip_address: string; user_agent: string }
  ) {
    const { email, password } = credentials;

    try {
      let user;
      try {
        user = await this.db.findUserByEmail(email);
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Internal server error."
        );
      }

      if (!(await comparePass(password, user.password))) {
        throw new Error("INVALID_CREDENTIALS");
      }

      const accessToken = createAccessToken({ id: user.id, email: user.email });
      const refreshToken = createRefreshToken({
        id: user.id,
        email: user.email,
      });

      await this.db.updateUserSession(user.id, {
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
      console.log("err: ", error);
      throw new Error(
        error instanceof Error ? error.message : "Internal server error."
      );
    }
  }

  async getUserProfile(userId: string) {
    return await this.db.findUserById(userId);
  }

  async refreshSession(refreshToken: string) {
    const userSession = await this.db.findUserByRefreshToken(refreshToken);

    if (!userSession) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    const { user, userId } = userSession;
    const accessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    await this.db.updateUserSession(userId, { refreshToken: newRefreshToken });

    return { accessToken, refreshToken: newRefreshToken, user };
  }

  async createSession(userId: string, sessionPayload: TUserSessionProps) {
    try {
      await this.db.createUserSession(userId, sessionPayload);
    } catch (error) {
      console.log("err ❌ ", error);
    }
  }

  async logout(userId: string) {
    return await this.db.logout(userId);
  }
}

export default AuthService;
