import { Router } from "express"
import { UsuarioController } from "../controllers/UsuarioController"
import { ObtenerUsuarios } from "../../application/useCases/usuarios/ObtenerUsuarios"
import { UsuarioRepository } from "../../infrastructure/persistence/repositories/UsuarioRepository"
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware"

const router = Router()

// Inicializar dependencias
const usuarioRepository = new UsuarioRepository()

// Inicializar casos de uso
const obtenerUsuariosUseCase = new ObtenerUsuarios(usuarioRepository)

// Inicializar controlador
const usuarioController = new UsuarioController(obtenerUsuariosUseCase)

// Definir rutas protegidas
router.get("/", authenticateToken, requireAdmin, (req, res) => usuarioController.listar(req, res))
router.get("/perfil", authenticateToken, (req, res) => usuarioController.obtenerPerfil(req, res))

export default router
