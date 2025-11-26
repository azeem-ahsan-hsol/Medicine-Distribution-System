import { BaseService } from "./base.service.js";
import { Customer } from "../models/customer.model.js";
import { Op } from "sequelize";

export class CustomerService extends BaseService {
  async getAll() {
    try {
      const customers = await Customer.findAll();
      return this.success("Customers fetched", customers);
    } catch (err) {
      this.error(err.message || "Failed to fetch customers", 500);
    }
  }

  async search(q) {
    try {
      if (!q) this.error("Search query is required", 400);

      const customers = await Customer.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${q}%` } },
            { license_no: { [Op.like]: `%${q}%` } }
          ]
        }
      });

      return this.success("Search results", customers);
    } catch (err) {
      this.error(err.message || "Failed to search customers", 500);
    }
  }

  async getById(id) {
    try {
      const customer = await Customer.findByPk(id);
      if (!customer) this.error("Customer not found", 404);
      return this.success("Customer fetched", customer);
    } catch (err) {
      this.error(err.message || "Failed to fetch customer", 500);
    }
  }

  async create(data) {
    return this.runTransaction(async (t) => {
      //check for existing customer with same name and license_no
      const existing = await Customer.findOne({
        where: { name: data.name, license_no: data.license_no },
        transaction: t
      });
      if (existing) this.error("Customer already exists", 400);
      const customer = await Customer.create(data, { transaction: t });
      return this.success("Customer created", customer);
    });
  }

  async update(id, data) {
    return this.runTransaction(async (t) => {
      const customer = await Customer.findByPk(id);
      if (!customer) this.error("Customer not found", 404);
      await customer.update(data, { transaction: t });
      return this.success("Customer updated", customer);
    });
  }

  async delete(id) {
    return this.runTransaction(async (t) => {
      const customer = await Customer.findByPk(id);
      if (!customer) this.error("Customer not found", 404);
      await customer.destroy({ transaction: t });
      return this.success("Customer deleted");
    });
  }
}
