import AuthDatabase from "../lib/db-service";

class AuthService {
  private db: AuthDatabase;
  constructor() {
    this.db = new AuthDatabase();
  }

  async signup() {}

  async signin() {}

  async getUserProfile() {}

  async refreshSession() {}

  async createSession() {}

  async logout() {}
}

export default AuthService;
