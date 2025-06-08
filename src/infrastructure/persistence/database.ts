import { Sequelize } from "sequelize"
import { config } from "dotenv"

config()

const sequelize = new Sequelize({
 
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: true,
  dialect: 'postgres',
})

export const createConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate()
    
    console.log("Conexión a la base de datos establecida correctamente.")
    
    await sequelize.sync({alter:true});
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error)
    throw error
  }
}

export { sequelize }