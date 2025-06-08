import { Sequelize } from "sequelize"
import dotenv from 'dotenv';
dotenv.config();
// Configuración de la conexión a la base de datos
const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASS as string,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT as unknown as number,
        dialect: 'postgres',
    }
);
export default sequelize
