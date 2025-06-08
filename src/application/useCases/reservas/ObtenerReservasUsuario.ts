import type { IReservaRepository } from "../../../core/interfaces/repositories/IReservaRepository"
import type { IEspacioRepository } from "../../../core/interfaces/repositories/IEspacioRepository"
import type { IUsuarioRepository } from "../../../core/interfaces/repositories/IUsuarioRepository"
import type { ReservaResponse } from "../../dto/responses/ReservaResponse"
import { ReservaMapper } from "../../mappers/ReservaMapper"
import { BusinessRuleException } from "../../../core/exceptions/index"

export class ObtenerReservasUsuario {
  constructor(
    private reservaRepository: IReservaRepository,
    private espacioRepository: IEspacioRepository,
    private usuarioRepository: IUsuarioRepository,
  ) {}

  async execute(usuarioId: number): Promise<ReservaResponse[]> {
    // Verificar que el usuario existe
    const usuario = await this.usuarioRepository.findById(usuarioId)
    if (!usuario) {
      throw new BusinessRuleException("El usuario no existe")
    }

    // Obtener reservas del usuario
    const reservas = await this.reservaRepository.findByUsuarioId(usuarioId)

    // Mapear reservas con información de espacios
    const reservasResponse: ReservaResponse[] = []

    for (const reserva of reservas) {
      const espacio = await this.espacioRepository.findById(reserva.espacio_id)
      reservasResponse.push(ReservaMapper.toResponse(reserva, usuario, espacio || undefined))
    }

    // Ordenar por fecha descendente (más recientes primero)
    return reservasResponse.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
  }
}
