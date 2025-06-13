import { Router } from "express"
import { AuthController } from "../controllers/AuthController"
import { LoginUsuario } from "../../application/useCases/auth/LoginUsuario"
import { RegistrarUsuario } from "../../application/useCases/usuarios/RegistrarUsuario"
import { UsuarioRepository } from "../../infrastructure/repositories/UsuarioRepository"
import { AuthService } from "../../infrastructure/services/AuthService"
import { ValidationService } from "../../infrastructure/services/ValidationService"

const router = Router()

// Inicializar dependencias
const usuarioRepository = new UsuarioRepository()
const authService = new AuthService()
const validationService = new ValidationService()

// Inicializar casos de uso
const loginUsuarioUseCase = new LoginUsuario(usuarioRepository, authService, validationService)
const registrarUsuarioUseCase = new RegistrarUsuario(usuarioRepository, validationService, authService)

// Inicializar controlador
const authController = new AuthController(loginUsuarioUseCase, registrarUsuarioUseCase)

// Definir rutas
router.post("/login", (req, res) => authController.login(req, res))
router.post("/register", (req, res) => authController.register(req, res))

export default router
