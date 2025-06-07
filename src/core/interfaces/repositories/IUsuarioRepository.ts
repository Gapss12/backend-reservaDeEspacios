import type { Usuario } from "../../entities/Usuario"

export interface IUsuarioRepository {
  findAll(): Promise<Usuario[]>
  findById(id: number): Promise<Usuario | null>
  findByEmail(email: string): Promise<Usuario | null>
  create(usuario: Usuario): Promise<Usuario>
  update(id: number, usuario: Partial<Usuario>): Promise<Usuario | null>
  delete(id: number): Promise<boolean>
}
