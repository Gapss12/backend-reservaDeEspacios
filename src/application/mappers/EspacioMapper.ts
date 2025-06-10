import type { Espacio } from "../../core/entities/Espacio"
import type { EspacioResponse } from "../dto/index"

export class EspacioMapper {
  static toResponse(espacio: Espacio): EspacioResponse {
    return {
      id: espacio.id!,
      nombre: espacio.nombre,
      tipo: espacio.tipo,
      capacidad: espacio.capacidad,
      image_url: espacio.image_url,
      disponible: espacio.disponible,
    }
  }

  static toResponseList(espacios: Espacio[]): EspacioResponse[] {
    return espacios.map((espacio) => this.toResponse(espacio))
  }
}
