import { Router } from "express"
import authRoutes from "./presentation/routes/authRoutes"

const router = Router()

router.use("/auth", authRoutes)

// Ruta de prueba
router.get('/', (req, res) => {
  res.send('API de Joyería funcionando correctamente');
});

export default router
