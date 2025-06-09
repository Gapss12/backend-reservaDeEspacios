import type { Reserva } from "../../core/entities/Reserva"
import { ReservaResponse, CrearReservaRequest } from "../dto/index"
import type { Usuario } from "../../core/entities/Usuario"
import type { Espacio } from "../../core/entities/Espacio"

export class ReservaMapper {
  static toEntity(request:  CrearReservaRequest): Reserva {
    return {
      usuario_id: request.usuario_id,
      espacio_id: request.espacio_id,
      fecha: new Date(request.fecha),
      hora_inicio: request.hora_inicio,
      hora_fin: request.hora_fin,
      estado: "pendiente",
    }
  }

  static toResponse(reserva: Reserva, usuario?: Usuario, espacio?: Espacio): ReservaResponse {
    const fecha = reserva.fecha instanceof Date ? reserva.fecha : new Date(reserva.fecha)
    return {
      id: reserva.id!,
      usuario: usuario
        ? {
            id: usuario.id!,
            nombre: usuario.nombre,
            email: usuario.email,
          }
        : {
            id: reserva.usuario_id,
            nombre: "Usuario no encontrado",
            email: "email@example.com",
          },
      espacio: espacio
        ? {
            id: espacio.id!,
            nombre: espacio.nombre,
            tipo: espacio.tipo,
          }
        : {
            id: reserva.espacio_id,
            nombre: "Espacio no encontrado",
            tipo: "desconocido",
          },
      fecha: fecha.toISOString().split("T")[0],
      hora_inicio: reserva.hora_inicio,
      hora_fin: reserva.hora_fin,
      estado: reserva.estado,
    }
  }
}
