import dotenv from "dotenv"

// Cargar variables de entorno según el ambiente
const environment = process.env.NODE_ENV || "development"
dotenv.config({ path: `.env.${environment}` })

export default {
  port: process.env.PORT || 3000,
  nodeEnv: environment,
  database: {
    name: process.env.DB_NAME || "reservas_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    dialect: "postgres",
  },
  email: {
    host: process.env.EMAIL_HOST || "smtp.ethereal.email",
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    user: process.env.EMAIL_USER || "ethereal.user@ethereal.email",
    password: process.env.EMAIL_PASSWORD || "ethereal_pass",
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
}
