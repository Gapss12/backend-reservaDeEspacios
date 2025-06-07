import type { Usuario } from "../../core/entities/Usuario"
import type { UsuarioResponse, CrearUsuarioRequest } from "../dto/index"

export class UsuarioMapper {
  static toEntity(request: CrearUsuarioRequest): Usuario {
    return {
      nombre: request.nombre,
      email: request.email,
      password: request.password,
      tipo: request.tipo,
    }
  }

  static toResponse(usuario: Usuario): UsuarioResponse {
    return {
      id: usuario.id!,
      nombre: usuario.nombre,
      email: usuario.email,
      tipo: usuario.tipo,
    }
  }

  static toResponseList(usuarios: Usuario[]): UsuarioResponse[] {
    return usuarios.map((usuario) => this.toResponse(usuario))
  }
}
