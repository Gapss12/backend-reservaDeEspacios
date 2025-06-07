export interface AuthResponse {
  token: string
  usuario: {
    id: number
    nombre: string
    email: string
    tipo: string
  }
}
