export interface Notificacion {
  id?: number
  usuario_id: number
  mensaje: string
  enviado: boolean
  fecha: Date
  createdAt?: Date
  updatedAt?: Date
}
