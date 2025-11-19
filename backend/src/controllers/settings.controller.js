import { SettingsService } from "../services/settings.service.js";

export class SettingsController {
  constructor() {
    this.svc = new SettingsService();
  }

  getAll(req, res, next) {
    this.svc.getAll().then(res.json.bind(res)).catch(next);
  }

  getOne(req, res, next) {
    this.svc.getOne(req.params.key).then(res.json.bind(res)).catch(next);
  }

  update(req, res, next) {
    this.svc.update(req.body).then(res.json.bind(res)).catch(next);
  }
}
