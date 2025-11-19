import { DashboardService } from "../services/dashboard.service.js";

export class DashboardController {
  constructor() {
    this.svc = new DashboardService();
  }

  async summary(req, res, next) {
    try {
      const result = await this.svc.summary();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
