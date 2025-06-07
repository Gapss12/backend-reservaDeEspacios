import type { Notificacion } from "../../entities/Notificacion"

export interface INotificacionRepository {
  findAll(): Promise<Notificacion[]>
  findById(id: number): Promise<Notificacion | null>
  findByUsuarioId(usuarioId: number): Promise<Notificacion[]>
  create(notificacion: Notificacion): Promise<Notificacion>
  update(id: number, notificacion: Partial<Notificacion>): Promise<Notificacion | null>
  delete(id: number): Promise<boolean>
}
