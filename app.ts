import express from "express"
import cors from "cors"
import morgan from "morgan"
import { errorHandler } from "./src/presentation/middleware/errorHandler"
import routes from "./src/index"
import { createConnection } from "./src/infrastructure/persistence/database"
import { config } from "dotenv"

// Cargar variables de entorno
config();
// Inicializar la aplicación Express
const app = express()
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Rutas
app.use("/api", routes)

// Middleware de manejo de errores
app.use(errorHandler)

// Iniciar el servidor
const startServer = async () => {
  try {
    await createConnection();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer()

export default app
