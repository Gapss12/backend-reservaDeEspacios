import type { IReservaRepository } from "../../../core/interfaces/repositories/IReservaRepository"
import type { IUsuarioRepository } from "../../../core/interfaces/repositories/IUsuarioRepository"
import type { IEspacioRepository } from "../../../core/interfaces/repositories/IEspacioRepository"
import type { ReservaResponse } from "../../dto/index"
import { ReservaMapper } from "../../mappers/ReservaMapper"

export class ListarReservasPorFecha {
  constructor(
    private reservaRepository: IReservaRepository,
    private usuarioRepository: IUsuarioRepository,
    private espacioRepository: IEspacioRepository,
  ) {}

  async execute(fecha: string): Promise<ReservaResponse[]> {
    const fechaObj = new Date(fecha)
    const reservas = await this.reservaRepository.findByFecha(fechaObj)

    const reservasResponse: ReservaResponse[] = []

    for (const reserva of reservas) {
      const usuario = await this.usuarioRepository.findById(reserva.usuario_id)
      const espacio = await this.espacioRepository.findById(reserva.espacio_id)

      reservasResponse.push(ReservaMapper.toResponse(reserva, usuario || undefined, espacio || undefined))
    }

    return reservasResponse
  }
}
