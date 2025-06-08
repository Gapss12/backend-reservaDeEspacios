import type { IEspacioRepository } from "../../../core/interfaces/repositories/IEspacioRepository"
import type { IReservaRepository } from "../../../core/interfaces/repositories/IReservaRepository"
import { BusinessRuleException } from "../../../core/exceptions/index"

export interface DisponibilidadRequest {
  espacio_id: number
  fecha: string 
  hora_inicio: string 
  hora_fin: string 
}

export interface DisponibilidadResponse {
  disponible: boolean
  espacio: {
    id: number
    nombre: string
    tipo: string
    capacidad: number
  }
  fecha: string
  hora_inicio: string
  hora_fin: string
  conflictos?: Array<{
    id: number
    hora_inicio: string
    hora_fin: string
    usuario: string
  }>
}

export class VerificarDisponibilidadEspacio {
  constructor(
    private espacioRepository: IEspacioRepository,
    private reservaRepository: IReservaRepository,
  ) {}

  async execute(request: DisponibilidadRequest): Promise<DisponibilidadResponse> {
    // Verificar que el espacio existe
    const espacio = await this.espacioRepository.findById(request.espacio_id)
    if (!espacio) {
      throw new BusinessRuleException("El espacio no existe")
    }

    // Verificar disponibilidad
    const disponible = await this.espacioRepository.verificarDisponibilidad(
      request.espacio_id,
      new Date(request.fecha),
      request.hora_inicio,
      request.hora_fin,
    )

    // Obtener reservas existentes para mostrar conflictos si los hay
    const reservasDelDia = await this.reservaRepository.findByFecha(new Date(request.fecha))
    const reservasDelEspacio = reservasDelDia.filter(
      (reserva) => reserva.espacio_id === request.espacio_id && reserva.estado !== "cancelada",
    )

    const conflictos = reservasDelEspacio.map((reserva) => ({
      id: reserva.id!,
      hora_inicio: reserva.hora_inicio,
      hora_fin: reserva.hora_fin,
      usuario: `Usuario ${reserva.usuario_id}`, // En un caso real, se haría join con usuario
    }))

    return {
      disponible,
      espacio: {
        id: espacio.id!,
        nombre: espacio.nombre,
        tipo: espacio.tipo,
        capacidad: espacio.capacidad,
      },
      fecha: request.fecha,
      hora_inicio: request.hora_inicio,
      hora_fin: request.hora_fin,
      conflictos: conflictos.length > 0 ? conflictos : undefined,
    }
  }
}
