import type { IReservaRepository } from "../../../core/interfaces/repositories/IReservaRepository"
import type { Reserva } from "../../../core/entities/Reserva"
import {ReservaModel} from "../../persistence/models/index"
import { Op } from "sequelize"

export class ReservaRepository implements IReservaRepository {
  async findAll(): Promise<Reserva[]> {
    const reservas = await ReservaModel.findAll()
    return reservas.map((reserva) => this.mapToEntity(reserva))
  }

  async findById(id: number): Promise<Reserva | null> {
    const reserva = await ReservaModel.findByPk(id)
    return reserva ? this.mapToEntity(reserva) : null
  }
  

  async findByUsuarioId(usuarioId: number): Promise<Reserva[]> {
    const reservas = await ReservaModel.findAll({ where: { usuario_id: usuarioId } })
    return reservas.map((reserva) => this.mapToEntity(reserva))
  }

  async findByEspacioId(espacioId: number): Promise<Reserva[]> {
    const reservas = await ReservaModel.findAll({ where: { espacio_id: espacioId } })
    return reservas.map((reserva) => this.mapToEntity(reserva))
  }

  async findByFecha(fecha: Date): Promise<Reserva[]> {
    const fechaStr = fecha.toISOString().split("T")[0]

    const reservas = await ReservaModel.findAll({
      where: {
        fecha: fechaStr,
      },
    })

    return reservas.map((reserva) => this.mapToEntity(reserva))
  }

   async create(reserva: Partial<Reserva>): Promise<Reserva> {
      // Añadir un día a la fecha
      if (reserva.fecha) {
          const fecha = new Date(reserva.fecha);
          fecha.setDate(fecha.getDate() + 1);
          reserva.fecha = fecha;
      }
      
      const nuevaReserva = await ReservaModel.create(reserva);
      return this.mapToEntity(nuevaReserva);
  }

  async update(id: number, reserva: Partial<Reserva>): Promise<Reserva | null> {
    const [affectedCount] = await ReservaModel.update(reserva, { where: { id } })

    if (affectedCount === 0) {
      return null
    }

    return this.findById(id)
  }

  async delete(id: number): Promise<boolean> {
    const affectedCount = await ReservaModel.destroy({ where: { id } })
    return affectedCount > 0
  }

  private mapToEntity(model: ReservaModel): Reserva {
    return {
      id: model.id,
      usuario_id: model.usuario_id,
      espacio_id: model.espacio_id,
      fecha: model.fecha,
      hora_inicio: model.hora_inicio,
      hora_fin: model.hora_fin,
      estado: model.estado,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
    async findConflictingReservations(
    espacioId: number,
    fecha: Date,
    horaInicio: string,
    horaFin: string,
    excludeReservaId?: number
  ): Promise<Reserva[]> {
    const whereClause: any = {
      espacio_id: espacioId,
      fecha: fecha,
      estado: { [Op.ne]: 'cancelada' },
      [Op.or]: [
        {
          hora_inicio: { [Op.between]: [horaInicio, horaFin] }
        },
        {
          hora_fin: { [Op.between]: [horaInicio, horaFin] }
        },
        {
          [Op.and]: [
            { hora_inicio: { [Op.lte]: horaInicio } },
            { hora_fin: { [Op.gte]: horaFin } }
          ]
        }
      ]
    };

    if (excludeReservaId) {
      whereClause.id = { [Op.ne]: excludeReservaId };
    }

    const reservas = await ReservaModel.findAll({ where: whereClause });
    return reservas.map(this.mapToEntity);
  }
}
