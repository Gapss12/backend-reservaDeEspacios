import type { IUsuarioRepository } from "../../../core/interfaces/repositories/IUsuarioRepository"
import type { Usuario } from "../../../core/entities/Usuario"
import {UsuarioModel} from "../../persistence/models/index"

export class UsuarioRepository implements IUsuarioRepository {
  async findAll(): Promise<Usuario[]> {
    const usuarios = await UsuarioModel.findAll()
    return usuarios.map((usuario) => this.mapToEntity(usuario))
  }

  async findById(id: number): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findByPk(id)
    return usuario ? this.mapToEntity(usuario) : null
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = await UsuarioModel.findOne({ where: { email } })
    return usuario ? this.mapToEntity(usuario) : null
  }

  async create(usuario: Partial<Usuario>): Promise<Usuario> {
    const nuevoUsuario = await UsuarioModel.create(usuario)
    return this.mapToEntity(nuevoUsuario)
  }

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario | null> {
    const [affectedCount] = await UsuarioModel.update(usuario, { where: { id } })

    if (affectedCount === 0) {
      return null
    }

    return this.findById(id)
  }

  async delete(id: number): Promise<boolean> {
    const affectedCount = await UsuarioModel.destroy({ where: { id } })
    return affectedCount > 0
  }

  private mapToEntity(model: UsuarioModel): Usuario {
    return {
      id: model.id,
      nombre: model.nombre,
      email: model.email,
      password: model.password,
      tipo: model.tipo,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
