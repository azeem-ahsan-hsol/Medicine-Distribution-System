import { sequelize } from "../config/db.js";

export class BaseService {
  async runTransaction(callback) {
    const t = await sequelize.transaction();
    try {
      const result = await callback(t);
      await t.commit();
      return result;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  success(message, data = null) {
    return { success: true, message, data };
  }

  error(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    throw err;
  }
}
