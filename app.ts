import express from "express"
import cors from "cors"
import morgan from "morgan"
import { errorHandler } from "./src/presentation/middleware/errorHandler"
import routes from "./src/index"
import sequelize from "./src/infrastructure/database/config/database"

// Inicializar la aplicación Express
const app = express()

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
    // Verificar conexión a la base de datos
    await sequelize.authenticate()
    console.log("Conexión a la base de datos establecida correctamente.")
    const port = process.env.PORT
    // Iniciar el servidor
    app.listen(port, () => {
      console.log(`Servidor iniciado en el puerto ${port}`)
    })
  } catch (error) {
    console.error("Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

startServer()

export default app
