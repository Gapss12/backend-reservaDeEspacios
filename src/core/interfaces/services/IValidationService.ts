export interface IValidationService {
  validarEmail(email: string): boolean
  validarHorario(horaInicio: string, horaFin: string): boolean
  validarFecha(fecha: Date): boolean
}
