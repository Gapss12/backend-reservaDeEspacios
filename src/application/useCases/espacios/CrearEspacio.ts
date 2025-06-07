import type { Espacio } from '../../../core/entities/Espacio'
import type { IEspacioRepository } from '../../../core/interfaces/repositories/IEspacioRepository'

export class CreateEspacioUseCase {
  constructor(private espacioRepository: IEspacioRepository) {}

  async execute(espacioData: Omit<Espacio, 'id' | 'createdAt' | 'updatedAt'>): Promise<Espacio> {
    return await this.espacioRepository.create(espacioData)
  }
}