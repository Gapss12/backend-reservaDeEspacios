import type { Request, Response } from "express"
import type { ListarEspacios } from "../../application/useCases/espacios/ListarEspacios"
import type { ObtenerEspaciosPorTipo } from "../../application/useCases/espacios/ObtenerEspaciosPorTipo"

export class EspacioController {
  constructor(
    private listarEspaciosUseCase: ListarEspacios,
    private obtenerEspaciosPorTipoUseCase: ObtenerEspaciosPorTipo,
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
}
