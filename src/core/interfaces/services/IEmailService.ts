export interface IEmailService {
  enviarEmail(destinatario: string, asunto: string, contenido: string): Promise<boolean>
  enviarConfirmacionReserva(email: string, detallesReserva: any): Promise<boolean>
  enviarRecordatorioReserva(email: string, detallesReserva: any): Promise<boolean>
}
