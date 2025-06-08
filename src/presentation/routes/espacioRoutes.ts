import { Router } from "express"
import { EspacioController } from "../controllers/EspacioController"
import { ListarEspacios } from "../../application/useCases/espacios/ListarEspacios"
import { ObtenerEspaciosPorTipo } from "../../application/useCases/espacios/ObtenerEspaciosPorTipo"
import { EspacioRepository } from "../../infrastructure/persistence/repositories/EspacioRepository"

const router = Router()

// Inicializar dependencias
const espacioRepository = new EspacioRepository()

// Inicializar casos de uso
const listarEspaciosUseCase = new ListarEspacios(espacioRepository)
const obtenerEspaciosPorTipoUseCase = new ObtenerEspaciosPorTipo(espacioRepository)

// Inicializar controlador
const espacioController = new EspacioController(listarEspaciosUseCase, obtenerEspaciosPorTipoUseCase)

// Definir rutas
router.get("/", (req, res) => espacioController.listar(req, res))
router.get("/:tipo", (req, res) => espacioController.listarPorTipo(req, res))

export default router
