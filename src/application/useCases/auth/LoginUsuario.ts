import type { IUsuarioRepository } from "../../../core/interfaces/repositories/IUsuarioRepository"
import type { IAuthService } from "../../../core/interfaces/services/IAuthService"
import type { IValidationService } from "../../../core/interfaces/services/IValidationService"
import { AuthenticationException, ValidationException } from "../../../core/exceptions/index"
import type { LoginRequest } from "../../dto/requests/LoginRequest"
import type { AuthResponse } from "../../dto/responses/AuthResponse"

export class LoginUsuario {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private authService: IAuthService,
    private validationService: IValidationService,
  ) {}

  async execute(request: LoginRequest): Promise<AuthResponse> {
    // Validar email
    if (!this.validationService.validarEmail(request.email)) {
      throw new ValidationException("El formato del email es inválido")
    }

    // Buscar usuario por email
    const usuario = await this.usuarioRepository.findByEmail(request.email)
    if (!usuario) {
      throw new AuthenticationException("Credenciales inválidas")
    }

    // Verificar contraseña
    const passwordValida = await this.authService.comparePassword(request.password, usuario.password)
    if (!passwordValida) {
      throw new AuthenticationException("Credenciales inválidas")
    }

    // Generar token JWT
    const token = this.authService.generateToken(usuario.id!, usuario.email, usuario.tipo)

    return {
      token,
      usuario: {
        id: usuario.id!,
        nombre: usuario.nombre,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    }
  }
}
