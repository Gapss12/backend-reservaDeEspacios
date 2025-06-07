export interface Usuario {
  id?: number
  nombre: string
  email: string
  password: string
  tipo: "admin" | "usuario"
  createdAt?: Date
  updatedAt?: Date
}
