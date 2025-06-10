import type { Request, Response } from "express"
import type { ListarEspacios } from "../../application/useCases/espacios/ListarEspacios"
import type { ObtenerEspaciosPorTipo } from "../../application/useCases/espacios/ObtenerEspaciosPorTipo"
import type { CrearEspacio } from "../../application/useCases/espacios/CrearEspacio"
import type { VerificarDisponibilidadEspacio } from "../../application/useCases/espacios/VerificarDisponibilidad"
import type { ObtenerCalendarioEspacio } from "../../application/useCases/espacios/ObtenerCalendarioEspacios"
import { ValidationException, BusinessRuleException } from "../../core/exceptions/index"

export class EspacioController {
  constructor(
    private listarEspaciosUseCase: ListarEspacios,
    private obtenerEspaciosPorTipoUseCase: ObtenerEspaciosPorTipo,
    private crearEspacioUseCase: CrearEspacio,
    private verificarDisponibilidadUseCase: VerificarDisponibilidadEspacio,
    private obtenerCalendarioUseCase: ObtenerCalendarioEspacio,
  ) {}

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const espacios = await this.listarEspaciosUseCase.execute()
      res.status(200).json(espacios)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  async listarPorTipo(req: Request, res: Response): Promise<void> {
    try {
      const { tipo } = req.params
      const espacios = await this.obtenerEspaciosPorTipoUseCase.execute(tipo)
      res.status(200).json(espacios)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }
  async crear(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, tipo, capacidad,image_url, disponible } = req.body

      const resultado = await this.crearEspacioUseCase.execute({
        nombre,
        tipo,
        capacidad,
        image_url,
        disponible,
      })

      res.status(201).json(resultado)
    } catch (error) {
      if (error instanceof ValidationException) {
        res.status(400).json({ error: error.message })
      } else if (error instanceof BusinessRuleException) {
        res.status(409).json({ error: error.message })
      } else {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }

  async verificarDisponibilidad(req: Request, res: Response): Promise<void> {
    try {
      const { fecha, hora_inicio, hora_fin } = req.query
      const  espacio_id  = req.params.espacio_id

      if (!fecha || !hora_inicio || !hora_fin) {
        res.status(400).json({ error: "Faltan parámetros requeridos" })
        return
      }
      console.log("Verificando disponibilidad para:", 
        espacio_id, fecha, hora_inicio, hora_fin)
      const resultado = await this.verificarDisponibilidadUseCase.execute({
        espacio_id: Number.parseInt(espacio_id),
        fecha: fecha as string,
        hora_inicio: hora_inicio as string,
        hora_fin: hora_fin as string,
      })

      res.status(200).json(resultado)
    } catch (error) {
      if (error instanceof BusinessRuleException) {
        res.status(400).json({ error: error.message })
      } else {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }

  async obtenerCalendario(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { fecha_inicio, fecha_fin } = req.query

      if (!fecha_inicio || !fecha_fin) {
        res.status(400).json({ error: "Faltan parámetros de fecha" })
        return
      }

      const resultado = await this.obtenerCalendarioUseCase.execute({
        espacio_id: Number.parseInt(id),
        fecha_inicio: fecha_inicio as string,
        fecha_fin: fecha_fin as string,
      })

      res.status(200).json(resultado)
    } catch (error) {
      if (error instanceof BusinessRuleException) {
        res.status(400).json({ error: error.message })
      } else {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }
}
