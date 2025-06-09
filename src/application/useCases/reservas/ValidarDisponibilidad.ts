import { IReservaRepository } from '../../../core/interfaces/repositories/IReservaRepository';

export class ValidarDisponibilidadReserva {
  constructor(private reservaRepository: IReservaRepository) {}

  async execute(
    espacioId: number,
    fecha: Date,
    horaInicio: string,
    horaFin: string,
    reservaIdExcluir?: number
  ): Promise<boolean> {
    const reservasConflictivas = await this.reservaRepository.findConflictingReservations(
      espacioId,
      fecha,
      horaInicio,
      horaFin,
      reservaIdExcluir
    );

    return reservasConflictivas.length === 0;
  }
}