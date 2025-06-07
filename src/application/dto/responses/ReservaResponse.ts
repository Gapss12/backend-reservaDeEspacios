export interface ReservaResponse {
  id: number
  usuario: {
    id: number
    nombre: string
    email: string
  }
  espacio: {
    id: number
    nombre: string
    tipo: string
  }
  fecha: string
  hora_inicio: string
  hora_fin: string
  estado: string
}
