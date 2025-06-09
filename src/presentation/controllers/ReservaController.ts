import type { Request, Response } from "express"
import type { CrearReserva } from "../../application/useCases/reservas/CrearReserva"
import type { ListarReservasPorFecha } from "../../application/useCases/reservas/ListarReservasPorFecha"
import type { CancelarReserva } from "../../application/useCases/reservas/CancelarReserva"
import type { ObtenerReservasUsuario } from "../../application/useCases/reservas/ObtenerReservasUsuario"
import { ValidationException, BusinessRuleException } from "../../core/exceptions/index"

export class ReservaController {
  constructor(
    private crearReservaUseCase: CrearReserva,
    private listarReservasPorFechaUseCase: ListarReservasPorFecha,
    private cancelarReservaUseCase: CancelarReserva,
    private obtenerReservasUsuarioUseCase: ObtenerReservasUsuario,
  ) {}

  async crear(req: Request, res: Response): Promise<void> {
    try {
      const { espacio_id, fecha, hora_inicio, hora_fin } = req.body
      const usuario_id = req.user?.userId

      if (!usuario_id) {
        res.status(401).json({ error: "Usuario no autenticado" })
        return
      }

      const resultado = await this.crearReservaUseCase.execute({
        usuario_id,
        espacio_id,
        fecha,
        hora_inicio,
        hora_fin,
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

  async listarPorFecha(req: Request, res: Response): Promise<void> {
    try {
      const { fecha } = req.params
      const reservas = await this.listarReservasPorFechaUseCase.execute(fecha)
      res.status(200).json(reservas)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  }

  async obtenerMisReservas(req: Request, res: Response): Promise<void> {
    try {
      const usuario_id = req.user?.userId
      console.log("ID de usuario:", usuario_id)
      if (!usuario_id) {
        res.status(401).json({ error: "Usuario no autenticado" })
        return
      }

      const reservas = await this.obtenerReservasUsuarioUseCase.execute(usuario_id)
      res.status(200).json(reservas)
    } catch (error) {
      if (error instanceof BusinessRuleException) {
        res.status(400).json({ error: error.message })
      } else {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }

  async cancelar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const resultado = await this.cancelarReservaUseCase.execute(Number.parseInt(id))

      if (resultado) {
        res.status(200).json({ message: "Reserva cancelada exitosamente" })
      } else {
        res.status(404).json({ error: "No se pudo cancelar la reserva" })
      }
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

