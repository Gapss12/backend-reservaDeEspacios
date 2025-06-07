import type { Notificacion } from "../../core/entities/Notificacion"
import type { NotificacionResponse } from "../dto/index"
import type { Usuario } from "../../core/entities/Usuario"

export class NotificacionMapper {
  static toResponse(notificacion: Notificacion, usuario?: Usuario): NotificacionResponse {
    return {
      id: notificacion.id!,
      usuario: usuario
        ? {
            id: usuario.id!,
            nombre: usuario.nombre,
            email: usuario.email,
          }
        : {
            id: notificacion.usuario_id,
            nombre: "Usuario no encontrado",
            email: "email@example.com",
          },
      mensaje: notificacion.mensaje,
      enviado: notificacion.enviado,
      fecha: notificacion.fecha.toISOString(),
    }
  }
}
