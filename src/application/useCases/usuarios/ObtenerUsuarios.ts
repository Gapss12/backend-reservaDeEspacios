import type { IUsuarioRepository } from "../../../core/interfaces/repositories/IUsuarioRepository"
import type { UsuarioResponse } from "../../dto/index"
import { UsuarioMapper } from "../../mappers/UsuarioMapper"

export class ObtenerUsuarios {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(): Promise<UsuarioResponse[]> {
    const usuarios = await this.usuarioRepository.findAll()
    return UsuarioMapper.toResponseList(usuarios)
  }
}
