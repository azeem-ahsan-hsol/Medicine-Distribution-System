import { BaseService } from "./base.service.js";
import { Supplier } from "../models/supplier.model.js";

export class SupplierService extends BaseService {
  async getAll() {
    try {
      const suppliers = await Supplier.findAll();
      return this.success("Suppliers fetched", suppliers);
    } catch (err) {
      this.error(err.message || "Failed to fetch suppliers", 500);
    }
  }

  async getById(id) {
    try {
      const supplier = await Supplier.findByPk(id);
      if (!supplier) this.error("Supplier not found", 404);
      return this.success("Supplier fetched", supplier);
    } catch (err) {
      this.error(err.message || "Failed to fetch supplier", 500);
    }
  }

  async create(data) {
    return this.runTransaction(async (t) => {
      const existing = await Supplier.findOne({
        where: { name: data.name, gst_no: data.gst_no },
        transaction: t
      });
      if (existing) this.error("Supplier already exists", 400);

      const supplier = await Supplier.create(data, { transaction: t });
      return this.success("Supplier created", supplier);
    });
  }

  async update(id, data) {
    return this.runTransaction(async (t) => {
      const supplier = await Supplier.findByPk(id);
      if (!supplier) this.error("Supplier not found", 404);
      await supplier.update(data, { transaction: t });
      return this.success("Supplier updated", supplier);
    });
  }

  async delete(id) {
    return this.runTransaction(async (t) => {
      const supplier = await Supplier.findByPk(id);
      if (!supplier) this.error("Supplier not found", 404);
      await supplier.destroy({ transaction: t });
      return this.success("Supplier deleted");
    });
  }
}
