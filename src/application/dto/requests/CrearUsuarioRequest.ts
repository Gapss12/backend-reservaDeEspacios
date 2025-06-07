export interface CrearUsuarioRequest {
  nombre: string
  email: string
  password: string
  tipo: "admin" | "usuario"
}
