import { Router } from "express"
import { EspacioController } from "../controllers/EspacioController"
import { ListarEspacios } from "../../application/useCases/espacios/ListarEspacios"
import { ObtenerEspaciosPorTipo } from "../../application/useCases/espacios/ObtenerEspaciosPorTipo"
import { EspacioRepository } from "../../infrastructure/repositories/EspacioRepository"
import { ReservaRepository } from "../../infrastructure/repositories/ReservaRepository"
import { UsuarioRepository } from "../../infrastructure/repositories/UsuarioRepository"
import { ValidationService } from "../../infrastructure/services/ValidationService"
import { CrearEspacio } from "../../application/useCases/espacios/CrearEspacio"
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware"
import { VerificarDisponibilidadEspacio } from "../../application/useCases/espacios/VerificarDisponibilidad"
import { ObtenerCalendarioEspacio } from "../../application/useCases/espacios/ObtenerCalendarioEspacios"

const router = Router()

// Inicializar dependencias
const espacioRepository = new EspacioRepository()
const reservaRepository = new ReservaRepository()
const usuarioRepository = new UsuarioRepository()
const validationService = new ValidationService()


// Inicializar casos de uso
const listarEspaciosUseCase = new ListarEspacios(espacioRepository)
const obtenerEspaciosPorTipoUseCase = new ObtenerEspaciosPorTipo(espacioRepository)
const crearEspacioUseCase = new CrearEspacio(espacioRepository, validationService)
const verificarDisponibilidadUseCase = new VerificarDisponibilidadEspacio(espacioRepository, reservaRepository)
const obtenerCalendarioUseCase = new ObtenerCalendarioEspacio(reservaRepository, espacioRepository, usuarioRepository)


// Inicializar controlador
const espacioController = new EspacioController(
  listarEspaciosUseCase,
  obtenerEspaciosPorTipoUseCase,
  crearEspacioUseCase,
  verificarDisponibilidadUseCase,
  obtenerCalendarioUseCase,
)

// Definir rutas
router.get("/", (req, res) => espacioController.listar(req, res))
router.get("/:tipo", (req, res) => espacioController.listarPorTipo(req, res))
router.post("/", authenticateToken, requireAdmin, (req, res) => espacioController.crear(req, res))
router.get("/disponibilidad/:espacio_id", authenticateToken, (req, res) => espacioController.verificarDisponibilidad(req, res))
router.get("/:id/calendario", authenticateToken, (req, res) => espacioController.obtenerCalendario(req, res))

export default router
