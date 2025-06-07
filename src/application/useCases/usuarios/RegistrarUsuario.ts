import type { IUsuarioRepository } from "../../../core/interfaces/repositories/IUsuarioRepository"
import type { IValidationService } from "../../../core/interfaces/services/IValidationService"
import type { IAuthService } from "../../../core/interfaces/services/IAuthService"
import { BusinessRuleException, ValidationException } from "../../../core/exceptions/index"
import type { UsuarioResponse,CrearUsuarioRequest } from "../../dto/index"
import { UsuarioMapper } from "../../mappers/UsuarioMapper"

export class RegistrarUsuario {
  constructor(
    private usuarioRepository: IUsuarioRepository,
    private validationService: IValidationService,
    private authService: IAuthService,
  ) {}

  async execute(request: CrearUsuarioRequest): Promise<UsuarioResponse> {
    // Validar email
    if (!this.validationService.validarEmail(request.email)) {
      throw new ValidationException("El formato del email es inválido")
    }

    // Validar contraseña
    if (!request.password || request.password.length < 6) {
      throw new ValidationException("La contraseña debe tener al menos 6 caracteres")
    }

    // Verificar si ya existe un usuario con ese email
    const usuarioExistente = await this.usuarioRepository.findByEmail(request.email)
    if (usuarioExistente) {
      throw new BusinessRuleException("Ya existe un usuario con ese email")
    }

    // Hash de la contraseña
    const hashedPassword = await this.authService.hashPassword(request.password)

    // Crear el usuario
    const nuevoUsuario = UsuarioMapper.toEntity({
      ...request,
      password: hashedPassword,
    })

    const usuarioCreado = await this.usuarioRepository.create(nuevoUsuario)

    return UsuarioMapper.toResponse(usuarioCreado)
  }
}
