import type { IReservaRepository } from "../../../core/interfaces/repositories/IReservaRepository"
import type { IUsuarioRepository } from "../../../core/interfaces/repositories/IUsuarioRepository"
import type { IEmailService } from "../../../core/interfaces/services/IEmailService"
import { BusinessRuleException } from "../../../core/exceptions/index"

export class CancelarReserva {
  constructor(
    private reservaRepository: IReservaRepository,
    private usuarioRepository: IUsuarioRepository,
    private emailService: IEmailService,
  ) {}

  async execute(id: number): Promise<boolean> {
    // Verificar que la reserva existe
    const reserva = await this.reservaRepository.findById(id)
    if (!reserva) {
      throw new BusinessRuleException("La reserva no existe")
    }

    // Verificar que la reserva no esté ya cancelada
    if (reserva.estado === "cancelada") {
      throw new BusinessRuleException("La reserva ya está cancelada")
    }

    // Actualizar el estado de la reserva
    const reservaActualizada = await this.reservaRepository.update(id, { estado: "cancelada" })

    if (!reservaActualizada) {
      throw new BusinessRuleException("No se pudo cancelar la reserva")
    }

    // Enviar notificación al usuario
    const usuario = await this.usuarioRepository.findById(reserva.usuario_id)
    if (usuario) {
      await this.emailService.enviarEmail(
        usuario.email,
        "Reserva Cancelada",
        `Su reserva para el día ${reserva.fecha} ha sido cancelada.`,
      )
    }

    return true
  }
}
