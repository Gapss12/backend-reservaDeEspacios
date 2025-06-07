export interface Reserva {
  id?: number
  usuario_id: number
  espacio_id: number
  fecha: Date
  hora_inicio: string
  hora_fin: string
  estado: "pendiente" | "confirmada" | "cancelada"
  createdAt?: Date
  updatedAt?: Date
}
