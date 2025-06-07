import type { Espacio } from "../../entities/Espacio"

export interface IEspacioRepository {
  findAll(): Promise<Espacio[]>
  findById(id: number): Promise<Espacio | null>
  findByTipo(tipo: string): Promise<Espacio[]>
  create(espacio: Espacio): Promise<Espacio>
  update(id: number, espacio: Partial<Espacio>): Promise<Espacio | null>
  delete(id: number): Promise<boolean>
  verificarDisponibilidad(id: number, fecha: Date, horaInicio: string, horaFin: string): Promise<boolean>
}
