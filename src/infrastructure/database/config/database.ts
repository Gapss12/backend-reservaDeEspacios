import { Sequelize } from "sequelize"

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME || "sistema_reservas",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
)

export default sequelize
