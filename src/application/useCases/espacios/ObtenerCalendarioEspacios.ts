import type { IReservaRepository } from "../../../core/interfaces/repositories/IReservaRepository"
import type { IEspacioRepository } from "../../../core/interfaces/repositories/IEspacioRepository"
import type { IUsuarioRepository } from "../../../core/interfaces/repositories/IUsuarioRepository"
import { BusinessRuleException } from "../../../core/exceptions/index"

export interface CalendarioRequest {
  espacio_id: number
  fecha_inicio: string 
  fecha_fin: string 
}

export interface ReservaCalendario {
  id: number
  fecha: string
  hora_inicio: string
  hora_fin: string
  estado: string
  usuario: {
    id: number
    nombre: string
  }
}

export interface CalendarioResponse {
  espacio: {
    id: number
    nombre: string
    tipo: string
    capacidad: number
  }
  periodo: {
    fecha_inicio: string
    fecha_fin: string
  }
  reservas: ReservaCalendario[]
  dias_disponibles: string[]
  dias_ocupados: string[]
}

export class ObtenerCalendarioEspacio {
  constructor(
    private reservaRepository: IReservaRepository,
    private espacioRepository: IEspacioRepository,
    private usuarioRepository: IUsuarioRepository,
  ) {}

  async execute(request: CalendarioRequest): Promise<CalendarioResponse> {
    // Verificar que el espacio existe
    const espacio = await this.espacioRepository.findById(request.espacio_id)
    if (!espacio) {
      throw new BusinessRuleException("El espacio no existe")
    }

    // Obtener todas las reservas del espacio en el rango de fechas
    const fechaInicio = new Date(request.fecha_inicio)
    const fechaFin = new Date(request.fecha_fin)

    // Generar array de fechas en el rango
    const fechas = this.generarRangoFechas(fechaInicio, fechaFin)

    // Obtener reservas para cada fecha
    const todasLasReservas: ReservaCalendario[] = []
    const diasOcupados = new Set<string>()

    for (const fecha of fechas) {
      const reservasDelDia = await this.reservaRepository.findByFecha(fecha)
      const reservasDelEspacio = reservasDelDia.filter(
        (reserva) => reserva.espacio_id === request.espacio_id && reserva.estado !== "cancelada",
      )

      for (const reserva of reservasDelEspacio) {
        const usuario = await this.usuarioRepository.findById(reserva.usuario_id)
        const fechaStr = fecha.toISOString().split("T")[0]

        todasLasReservas.push({
          id: reserva.id!,
          fecha: fechaStr,
          hora_inicio: reserva.hora_inicio,
          hora_fin: reserva.hora_fin,
          estado: reserva.estado,
          usuario: {
            id: usuario?.id || 0,
            nombre: usuario?.nombre || "Usuario no encontrado",
          },
        })

        diasOcupados.add(fechaStr)
      }
    }

    // Calcular días disponibles (días sin reservas)
    const diasDisponibles = fechas
      .map((fecha) => fecha.toISOString().split("T")[0])
      .filter((fecha) => !diasOcupados.has(fecha))

    return {
      espacio: {
        id: espacio.id!,
        nombre: espacio.nombre,
        tipo: espacio.tipo,
        capacidad: espacio.capacidad,
      },
      periodo: {
        fecha_inicio: request.fecha_inicio,
        fecha_fin: request.fecha_fin,
      },
      reservas: todasLasReservas,
      dias_disponibles: diasDisponibles,
      dias_ocupados: Array.from(diasOcupados),
    }
  }

  private generarRangoFechas(fechaInicio: Date, fechaFin: Date): Date[] {
    const fechas: Date[] = []
    const fechaActual = new Date(fechaInicio)

    while (fechaActual <= fechaFin) {
      fechas.push(new Date(fechaActual))
      fechaActual.setDate(fechaActual.getDate() + 1)
    }

    return fechas
  }
}
