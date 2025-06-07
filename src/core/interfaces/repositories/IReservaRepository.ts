import type { Reserva } from "../../entities/Reserva"

export interface IReservaRepository {
  findAll(): Promise<Reserva[]>
  findById(id: number): Promise<Reserva | null>
  findByUsuarioId(usuarioId: number): Promise<Reserva[]>
  findByEspacioId(espacioId: number): Promise<Reserva[]>
  findByFecha(fecha: Date): Promise<Reserva[]>
  create(reserva: Reserva): Promise<Reserva>
  update(id: number, reserva: Partial<Reserva>): Promise<Reserva | null>
  delete(id: number): Promise<boolean>
}
