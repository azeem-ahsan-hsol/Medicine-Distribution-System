import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root (two levels up from config.js)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Debug logs (remove once working)
console.log("ENV → DB_USER:", process.env.DB_USER);
console.log("ENV → DB_DIALECT:", process.env.DB_DIALECT);

export default {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "root",
    database: process.env.DB_NAME || "pharma_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER || "pharma_user",
    password: process.env.DB_PASS || "YourStrongPassword",
    database: process.env.DB_NAME || "pharma_db",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  },
};
