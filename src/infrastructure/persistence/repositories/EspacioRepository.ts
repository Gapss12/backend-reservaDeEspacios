import type { IEspacioRepository } from "../../../core/interfaces/repositories/IEspacioRepository"
import type { Espacio } from "../../../core/entities/Espacio"
import {EspacioModel, ReservaModel} from "../../persistence/models/index"
import { Op } from "sequelize"

export class EspacioRepository implements IEspacioRepository {
  async findAll(): Promise<Espacio[]> {
    const espacios = await EspacioModel.findAll()
    return espacios.map((espacio) => this.mapToEntity(espacio))
  }

  async findById(id: number): Promise<Espacio | null> {
    const espacio = await EspacioModel.findByPk(id)
    return espacio ? this.mapToEntity(espacio) : null
  }

  async findByTipo(tipo: string): Promise<Espacio[]> {
    const espacios = await EspacioModel.findAll({ where: { tipo } })
    return espacios.map((espacio) => this.mapToEntity(espacio))
  }

  async create(espacio: Partial<Espacio> ): Promise<Espacio> {
    const nuevoEspacio = await EspacioModel.create(espacio)
    return this.mapToEntity(nuevoEspacio)
  }


  async update(id: number, espacio: Partial<Espacio>): Promise<Espacio | null> {
    const [affectedCount] = await EspacioModel.update(espacio, { where: { id } })

    if (affectedCount === 0) {
      return null
    }

    return this.findById(id)
  }

  async delete(id: number): Promise<boolean> {
    const affectedCount = await EspacioModel.destroy({ where: { id } })
    return affectedCount > 0
  }

  async verificarDisponibilidad(id: number, fecha: Date, horaInicio: string, horaFin: string): Promise<boolean> {
    // Verificar si el espacio existe y está disponible
    const espacio = await EspacioModel.findByPk(id)
    if (!espacio || !espacio.disponible) {
      return false
    }

    // Convertir la fecha a formato YYYY-MM-DD para la consulta
    const fechaStr = fecha.toISOString().split("T")[0]

    // Buscar reservas que se solapen con el horario solicitado
    const reservasExistentes = await ReservaModel.findAll({
      where: {
        espacio_id: id,
        fecha: fechaStr,
        estado: {
          [Op.ne]: "cancelada", // No considerar reservas canceladas
        },
        [Op.or]: [
          {
            // Caso 1: La hora de inicio solicitada está dentro de una reserva existente
            [Op.and]: [{ hora_inicio: { [Op.lte]: horaInicio } }, { hora_fin: { [Op.gt]: horaInicio } }],
          },
          {
            // Caso 2: La hora de fin solicitada está dentro de una reserva existente
            [Op.and]: [{ hora_inicio: { [Op.lt]: horaFin } }, { hora_fin: { [Op.gte]: horaFin } }],
          },
          {
            // Caso 3: La reserva solicitada contiene completamente a una reserva existente
            [Op.and]: [{ hora_inicio: { [Op.gte]: horaInicio } }, { hora_fin: { [Op.lte]: horaFin } }],
          },
        ],
      },
    })

    // Si no hay reservas que se solapen, el espacio está disponible
    return reservasExistentes.length === 0
  }

  private mapToEntity(model: EspacioModel): Espacio {
    return {
      id: model.id,
      nombre: model.nombre,
      tipo: model.tipo,
      capacidad: model.capacidad,
      image_url: model.image_url,
      disponible: model.disponible,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }
}
