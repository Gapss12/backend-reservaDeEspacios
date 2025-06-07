import type { IEspacioRepository } from "../../../core/interfaces/repositories/IEspacioRepository"
import type { EspacioResponse } from "../../dto/responses/EspacioResponse"
import { EspacioMapper } from "../../mappers/EspacioMapper"

export class ListarEspacios {
  constructor(private espacioRepository: IEspacioRepository) {}

  async execute(): Promise<EspacioResponse[]> {
    const espacios = await this.espacioRepository.findAll()
    return EspacioMapper.toResponseList(espacios)
  }
}
