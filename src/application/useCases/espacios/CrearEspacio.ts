import type { IEspacioRepository } from "../../../core/interfaces/repositories/IEspacioRepository"
import type { IValidationService } from "../../../core/interfaces/services/IValidationService"
import { ValidationException } from "../../../core/exceptions/index"
import type { EspacioResponse } from "../../dto/responses/EspacioResponse"
import { EspacioMapper } from "../../mappers/EspacioMapper"

export interface CrearEspacioRequest {
  nombre: string
  tipo: string
  capacidad: number
  image_url?: string
  disponible?: boolean
}

export class CrearEspacio {
  constructor(
    private espacioRepository: IEspacioRepository,
    private validationService: IValidationService,
  ) {}

  async execute(request: CrearEspacioRequest): Promise<EspacioResponse> {
    // Validaciones básicas
    if (!request.nombre || request.nombre.trim().length === 0) {
      throw new ValidationException("El nombre del espacio es requerido")
    }

    if (!request.tipo || request.tipo.trim().length === 0) {
      throw new ValidationException("El tipo del espacio es requerido")
    }

    if (!request.capacidad || request.capacidad <= 0) {
      throw new ValidationException("La capacidad debe ser mayor a 0")
    }

    // Crear el espacio
    const nuevoEspacio = {
      nombre: request.nombre.trim(),
      tipo: request.tipo.trim().toLowerCase(),
      capacidad: request.capacidad,
      image_url: request.image_url,
      disponible: request.disponible !== false,
    }

    const espacioCreado = await this.espacioRepository.create(nuevoEspacio)
    return EspacioMapper.toResponse(espacioCreado)
  }
}
