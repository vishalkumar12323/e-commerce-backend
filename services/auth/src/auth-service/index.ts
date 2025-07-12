import AuthDatabase from "../lib/db-service";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
} from "../utils/token-service";
import { comparePass } from "../utils/password-service";

type TUserProps = {
  name: string;
  email: string;
  password: string;
  phone_number: string;
};

type TUserCredentials = Omit<TUserProps, "name" | "phone_number">;
class AuthService {
  private db: AuthDatabase;
  constructor() {
    this.db = new AuthDatabase();
  }

  async signup(userData: TUserProps) {
    try {
      const user = await this.db.createUser(userData);
      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      await this.db.createUserSession(user.id, refreshToken);
      return { accessToken, refreshToken, user };
    } catch (error) {
      console.error("Error during signup:", error);
      if (error instanceof Error && error.message === "USER_EXISTS") {
        throw error;
      }
      throw new Error("Error during signup");
    }
  }

  async signin(credentials: TUserCredentials) {
    const { email, password } = credentials;

    try {
      let user;
      try {
        user = await this.db.findUserByEmail(email);
      } catch (error) {
        if (error instanceof Error && error.message === "USER_NOT_FOUND") {
          throw new Error("INVALID_CREDENTIALS");
        }
        throw error;
      }

      if (!(await comparePass(password, user.password))) {
        throw new Error("INVALID_CREDENTIALS");
      }

      const accessToken = createAccessToken({ id: user.id, email: user.email });
      const refreshToken = createRefreshToken({
        id: user.id,
        email: user.email,
      });

      await this.db.updateUserSession(user.id, refreshToken);
      return {
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email },
      };
    } catch (error) {}
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

    await this.db.updateUserSession(userId, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken, user };
  }

  async createSession() {}

  async logout(userId: string) {
    return await this.db.logout(userId);
  }
}

export default AuthService;
