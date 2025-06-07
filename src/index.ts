import { Router } from "express"
import authRoutes from "./presentation/routes/authRoutes"

const router = Router()

router.use("/auth", authRoutes)

export default router
