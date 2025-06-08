import type { INotificacionRepository } from "../../../core/interfaces/repositories/INotificacionRepository"
import type { Notificacion } from "../../../core/entities/Notificacion"
import {NotificacionModel} from "../../persistence/models/index"

export class NotificacionRepository implements INotificacionRepository {
  async findAll(): Promise<Notificacion[]> {
    const notificaciones = await NotificacionModel.findAll()
    return notificaciones.map((notificacion) => this.mapToEntity(notificacion))
  }

  async findById(id: number): Promise<Notificacion | null> {
    const notificacion = await NotificacionModel.findByPk(id)
    return notificacion ? this.mapToEntity(notificacion) : null
  }

  async findByUsuarioId(usuarioId: number): Promise<Notificacion[]> {
    const notificaciones = await NotificacionModel.findAll({ where: { usuario_id: usuarioId } })
    return notificaciones.map((notificacion) => this.mapToEntity(notificacion))
  }

  async create(notificacion: Partial<Notificacion>): Promise<Notificacion> {
    const nuevaNotificacion = await NotificacionModel.create(notificacion)
    return this.mapToEntity(nuevaNotificacion)
  }

  async update(id: number, notificacion: Partial<Notificacion>): Promise<Notificacion | null> {
    const [affectedCount] = await NotificacionModel.update(notificacion, { where: { id } })

    if (affectedCount === 0) {
      return null
    }

    return this.findById(id)
  }

  async delete(id: number): Promise<boolean> {
    const affectedCount = await NotificacionModel.destroy({ where: { id } })
    return affectedCount > 0
  }

  private mapToEntity(model: NotificacionModel): Notificacion {
    return {
      id: model.id,
      usuario_id: model.usuario_id,
      mensaje: model.mensaje,
      enviado: model.enviado,
      fecha: model.fecha,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
