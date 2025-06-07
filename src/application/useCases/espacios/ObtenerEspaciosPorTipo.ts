import type { IEspacioRepository } from "../../../core/interfaces/repositories/IEspacioRepository"
import type { EspacioResponse } from "../../dto/responses/EspacioResponse"
import { EspacioMapper } from "../../mappers/EspacioMapper"

export class ObtenerEspaciosPorTipo {
  constructor(private espacioRepository: IEspacioRepository) {}

  async execute(tipo: string): Promise<EspacioResponse[]> {
    const espacios = await this.espacioRepository.findByTipo(tipo)
    return EspacioMapper.toResponseList(espacios)
  }
}
