import type { IReservaRepository } from "../../../core/interfaces/repositories/IReservaRepository"
import type { IEspacioRepository } from "../../../core/interfaces/repositories/IEspacioRepository"
import type { IUsuarioRepository } from "../../../core/interfaces/repositories/IUsuarioRepository"
import type { IEmailService } from "../../../core/interfaces/services/IEmailService"
import type { IValidationService } from "../../../core/interfaces/services/IValidationService"
import { BusinessRuleException,ValidationException  } from "../../../core/exceptions/index"
import type { ReservaResponse, CrearReservaRequest } from "../../dto/index"
import { ReservaMapper } from "../../mappers/ReservaMapper"
import { ValidarDisponibilidadReserva } from "./ValidarDisponibilidad"

export class CrearReserva {
  constructor(
    private reservaRepository: IReservaRepository,
    private espacioRepository: IEspacioRepository,
    private usuarioRepository: IUsuarioRepository,
    private emailService: IEmailService,
    private validationService: IValidationService,
    private validarDisponibilidadReserva: ValidarDisponibilidadReserva
  ) {}

  async execute(request: CrearReservaRequest): Promise<ReservaResponse> {
    // Validar formato de fecha y hora
    if (!this.validationService.validarFecha(new Date(request.fecha))) {
      throw new ValidationException("El formato de la fecha es inválido")
    }

    if (!this.validationService.validarHorario(request.hora_inicio, request.hora_fin)) {
      throw new ValidationException("El horario especificado es inválido")
    }

    // Verificar que el usuario existe
    const usuario = await this.usuarioRepository.findById(request.usuario_id)
    if (!usuario) {
      throw new BusinessRuleException("El usuario no existe")
    }

    // Verificar que el espacio existe
    const espacio = await this.espacioRepository.findById(request.espacio_id)
    if (!espacio) {
      throw new BusinessRuleException("El espacio no existe")
    }

    // Validar disponibilidad
    const disponible = await this.validarDisponibilidadReserva.execute(
      request.espacio_id,
      new Date(request.fecha),
      request.hora_inicio,
      request.hora_fin
    );

    if (!disponible) {
      throw new Error('El espacio ya está reservado para el horario solicitado');
    }

    // Crear la reserva
    const nuevaReserva = ReservaMapper.toEntity(request)
    const reservaCreada = await this.reservaRepository.create(nuevaReserva)

    // Enviar email de confirmación
    await this.emailService.enviarConfirmacionReserva(usuario.email, {
      nombreUsuario: usuario.nombre,
      nombreEspacio: espacio.nombre,
      fecha: request.fecha,
      horaInicio: request.hora_inicio,
      horaFin: request.hora_fin,
    })

    return ReservaMapper.toResponse(reservaCreada, usuario, espacio)
  }
}
