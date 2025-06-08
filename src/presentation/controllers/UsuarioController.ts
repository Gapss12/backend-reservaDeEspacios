import type { Request, Response } from "express"
import type { ObtenerUsuarios } from "../../application/useCases/usuarios/ObtenerUsuarios"

export class UsuarioController {
  constructor(private obtenerUsuariosUseCase: ObtenerUsuarios) {}

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await this.obtenerUsuariosUseCase.execute()
      res.status(200).json(usuarios)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  async obtenerPerfil(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.user
      res.status(200).json(usuario)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }
}
