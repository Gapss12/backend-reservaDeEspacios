import { Router } from "express"
import { ReservaController } from "../controllers/ReservaController"
import { CrearReserva } from "../../application/useCases/reservas/CrearReserva"
import { ListarReservasPorFecha } from "../../application/useCases/reservas/ListarReservasPorFecha"
import { CancelarReserva } from "../../application/useCases/reservas/CancelarReserva"
import { ObtenerReservasUsuario } from "../../application/useCases/reservas/ObtenerReservasUsuario"
import { ValidarDisponibilidadReserva } from "../../application/useCases/reservas/ValidarDisponibilidad"
import { ReservaRepository } from "../../infrastructure/repositories/ReservaRepository"
import { EspacioRepository } from "../../infrastructure/repositories/EspacioRepository"
import { UsuarioRepository } from "../../infrastructure/repositories/UsuarioRepository"
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

// Crear primero la instancia de ValidarDisponibilidadReserva
const validarDisponibilidadReservaUseCase = new ValidarDisponibilidadReserva(reservaRepository)

// Luego usar la instancia correcta en CrearReserva
const crearReservaUseCase = new CrearReserva(
  reservaRepository,
  espacioRepository, 
  usuarioRepository,
  emailService,
  validationService,
  validarDisponibilidadReservaUseCase
)

const listarReservasPorFechaUseCase = new ListarReservasPorFecha(
  reservaRepository,
  usuarioRepository,
  espacioRepository,
)

const cancelarReservaUseCase = new CancelarReserva(reservaRepository, usuarioRepository, emailService)

const obtenerReservasUsuarioUseCase = new ObtenerReservasUsuario(
  reservaRepository,
  espacioRepository,
  usuarioRepository,
)

// Inicializar controlador
const reservaController = new ReservaController(
  crearReservaUseCase,
  listarReservasPorFechaUseCase,
  cancelarReservaUseCase,
  obtenerReservasUsuarioUseCase,
)

// Definir rutas protegidas
router.post("/", authenticateToken, (req, res) => reservaController.crear(req, res))
router.get("/fecha/:fecha", authenticateToken, requireAdmin, (req, res) => reservaController.listarPorFecha(req, res))
router.delete("/:id", authenticateToken, (req, res) => reservaController.cancelar(req, res))
router.get("/mis-reservas", authenticateToken, (req, res) => reservaController.obtenerMisReservas(req, res))

export default router
