export interface NotificacionResponse {
  id: number
  usuario: {
    id: number
    nombre: string
    email: string
  }
  mensaje: string
  enviado: boolean
  fecha: string
}
