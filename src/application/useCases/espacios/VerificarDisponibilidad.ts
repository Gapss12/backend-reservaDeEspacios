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

  private hayConflictoHorario(
    inicio1: string,
    fin1: string,
    inicio2: string,
    fin2: string
  ): boolean {
    return (
      (inicio1 >= inicio2 && inicio1 < fin2) ||
      (fin1 > inicio2 && fin1 <= fin2) ||
      (inicio1 <= inicio2 && fin1 >= fin2)
    )
  }

  async execute(request: DisponibilidadRequest): Promise<DisponibilidadResponse> {
    // Remove console.log statements
    const { espacio_id, fecha, hora_inicio, hora_fin } = request

    // Verificar que el espacio existe
    const espacio = await this.espacioRepository.findById(espacio_id)
    if (!espacio) {
      throw new BusinessRuleException("El espacio no existe")
    }

    // Convertir fecha string a Date
    const fechaReserva = new Date(fecha)
    
    // Verificar disponibilidad básica del espacio
    const disponible = await this.espacioRepository.verificarDisponibilidad(
      espacio_id,
      fechaReserva,
      hora_inicio,
      hora_fin
    )

    // Obtener reservas existentes para la fecha
    const reservasDelDia = await this.reservaRepository.findByFecha(fechaReserva)
    
    // Solo buscar conflictos si el espacio no está disponible
    let conflictos = undefined
    
    if (!disponible) {
      const reservasConflictivas = reservasDelDia.filter(reserva => 
        reserva.espacio_id === espacio_id &&
        reserva.estado !== "cancelada" &&
        this.hayConflictoHorario(
          hora_inicio,
          hora_fin,
          reserva.hora_inicio,
          reserva.hora_fin
        )
      )

      conflictos = reservasConflictivas.map(reserva => ({
        id: reserva.id!,
        hora_inicio: reserva.hora_inicio,
        hora_fin: reserva.hora_fin,
        usuario: `Usuario ${reserva.usuario_id}`,
      }))
    }

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
      conflictos
    }
  }
}