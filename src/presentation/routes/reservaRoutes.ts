import { Router } from "express"
import { ReservaController } from "../controllers/ReservaController"
import { CrearReserva } from "../../application/useCases/reservas/CrearReserva"
import { ListarReservasPorFecha } from "../../application/useCases/reservas/ListarReservasPorFecha"
import { CancelarReserva } from "../../application/useCases/reservas/CancelarReserva"
import { ReservaRepository } from "../../infrastructure/persistence/repositories/ReservaRepository"
import { EspacioRepository } from "../../infrastructure/persistence/repositories/EspacioRepository"
import { UsuarioRepository } from "../../infrastructure/persistence/repositories/UsuarioRepository"
import { EmailService } from "../../infrastructure/services/EmailService"
import { ValidationService } from "../../infrastructure/services/ValidationService"
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware"

const router = Router()

// Inicializar dependencias
const reservaRepository = new ReservaRepository()
const espacioRepository = new EspacioRepository()
const usuarioRepository = new UsuarioRepository()
const emailService = new EmailService()
const validationService = new ValidationService()

// Inicializar casos de uso
const crearReservaUseCase = new CrearReserva(
  reservaRepository,
  espacioRepository,
  usuarioRepository,
  emailService,
  validationService,
)

const listarReservasPorFechaUseCase = new ListarReservasPorFecha(
  reservaRepository,
  usuarioRepository,
  espacioRepository,
)

const cancelarReservaUseCase = new CancelarReserva(reservaRepository, usuarioRepository, emailService)

// Inicializar controlador
const reservaController = new ReservaController(
  crearReservaUseCase,
  listarReservasPorFechaUseCase,
  cancelarReservaUseCase,
)

// Definir rutas protegidas
router.post("/", authenticateToken, (req, res) => reservaController.crear(req, res))
router.get("/fecha/:fecha", authenticateToken, requireAdmin, (req, res) => reservaController.listarPorFecha(req, res))
router.delete("/:id", authenticateToken, (req, res) => reservaController.cancelar(req, res))

export default router
