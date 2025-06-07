import type { IEmailService } from "../../core/interfaces/services/IEmailService"

export class EmailService implements IEmailService {
  async enviarEmail(destinatario: string, asunto: string, contenido: string): Promise<boolean> {
    // En un entorno real, aquí se integraría con un servicio de email como Nodemailer, SendGrid, etc.
    console.log(`Enviando email a ${destinatario}`)
    console.log(`Asunto: ${asunto}`)
    console.log(`Contenido: ${contenido}`)

    // Simulamos un envío exitoso
    return true
  }

  async enviarConfirmacionReserva(email: string, detallesReserva: any): Promise<boolean> {
    const asunto = "Confirmación de Reserva"
    const contenido = `
      Hola ${detallesReserva.nombreUsuario},
      
      Tu reserva ha sido confirmada con los siguientes detalles:
      
      Espacio: ${detallesReserva.nombreEspacio}
      Fecha: ${detallesReserva.fecha}
      Hora: ${detallesReserva.horaInicio} - ${detallesReserva.horaFin}
      
      Gracias por utilizar nuestro sistema de reservas.
    `

    return this.enviarEmail(email, asunto, contenido)
  }

  async enviarRecordatorioReserva(email: string, detallesReserva: any): Promise<boolean> {
    const asunto = "Recordatorio de Reserva"
    const contenido = `
      Hola ${detallesReserva.nombreUsuario},
      
      Te recordamos que tienes una reserva programada para mañana:
      
      Espacio: ${detallesReserva.nombreEspacio}
      Fecha: ${detallesReserva.fecha}
      Hora: ${detallesReserva.horaInicio} - ${detallesReserva.horaFin}
      
      Gracias por utilizar nuestro sistema de reservas.
    `

    return this.enviarEmail(email, asunto, contenido)
  }
}
