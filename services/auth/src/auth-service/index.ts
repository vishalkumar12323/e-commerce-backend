import AuthDatabase from "../lib/db-service.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/token-service.js";
import { comparePass } from "../utils/password-service.js";
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
      console.log("err: ", error);
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
}

export default AuthService;
