import { AuthService } from "../services/auth.service.js";

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res, next) {
    try {
      const result = await this.authService.login(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async register(req, res, next) {
    try {
      const result = await this.authService.register(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
