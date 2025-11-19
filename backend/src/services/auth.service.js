import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { BaseService } from "./base.service.js";

export class AuthService extends BaseService {
  async login(data) {
    const { email, password } = data;

    const user = await User.findOne({ where: { email } });
    if (!user) this.error("Invalid email or password", 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) this.error("Invalid email or password", 401);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return this.success("Login successful", { token });
  }

  async register(data) {
    return this.runTransaction(async (t) => {
      const { name, email, password, role } = data;

      const exists = await User.findOne({ where: { email } });
      if (exists) this.error("Email already exists");

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create(
        { name, email, password: hashed, role },
        { transaction: t }
      );

      return this.success("User registered", user);
    });
  }
}
