import { BaseService } from "./base.service.js";
import { Setting } from "../models/index.js";

export class SettingsService extends BaseService {
  /**
   * Return all settings as object:
   * {
   *   store_name: "...",
   *   low_stock_limit: "10",
   *   near_expiry_days: "30",
   *   invoice_prefix: "INV-",
   *   ...
   * }
   */
  async getAll() {
    try {
      const rows = await Setting.findAll();
      const mapped = {};

      rows.forEach((s) => {
        try {
          mapped[s.key] = JSON.parse(s.value);
        } catch {
          mapped[s.key] = s.value;
        }
      });

      return this.success("Settings loaded", mapped);
    } catch (err) {
      this.error(err.message || "Failed to load settings", 500);
    }
  }

  async getOne(key) {
    try {
      const s = await Setting.findOne({ where: { key } });
      if (!s) this.error("Setting not found", 404);

      let val;
      try {
        val = JSON.parse(s.value);
      } catch {
        val = s.value;
      }

      return this.success("Setting loaded", { key, value: val });
    } catch (err) {
      this.error(err.message || "Failed to load setting", 500);
    }
  }

  /**
   * Update settings in bulk:
   * {
   *   store_name: "My Pharmacy",
   *   low_stock_limit: 20,
   *   near_expiry_days: 40,
   *   invoice_prefix: "INV-",
   *   invoice_footer: "Thank you!",
   * }
   */
  async update(data) {
    return this.runTransaction(async (t) => {
      const keys = Object.keys(data);

      for (const key of keys) {
        const value = JSON.stringify(data[key]);

        const existing = await Setting.findOne({ where: { key }, transaction: t });

        if (existing) {
          await existing.update({ value }, { transaction: t });
        } else {
          await Setting.create({ key, value }, { transaction: t });
        }
      }

      return this.success("Settings updated", data);
    });
  }
}
