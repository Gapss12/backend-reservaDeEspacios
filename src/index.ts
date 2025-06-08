import { Router } from "express"
import authRoutes from "./presentation/routes/authRoutes";
import usuarioRoutes from "./presentation/routes/usuarioRoutes";
import espacioRoutes from "./presentation/routes/espacioRoutes";
import reservaRoutes from "./presentation/routes/reservaRoutes";


const router = Router()

router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/espacios", espacioRoutes);
router.use("/reservas", reservaRoutes); 

// Ruta de prueba
router.get('/', (req, res) => {
  res.send('API Resevas funcionando correctamente');
});

export default router
