import type { IValidationService } from "../../core/interfaces/services/IValidationService"

export class ValidationService implements IValidationService {
  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  validarHorario(horaInicio: string, horaFin: string): boolean {
    // Validar formato HH:MM
    const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

    if (!horaRegex.test(horaInicio) || !horaRegex.test(horaFin)) {
      return false
    }

    // Convertir a minutos para comparar
    const [horaInicioHora, horaInicioMinuto] = horaInicio.split(":").map(Number)
    const [horaFinHora, horaFinMinuto] = horaFin.split(":").map(Number)

    const minutosInicio = horaInicioHora * 60 + horaInicioMinuto
    const minutosFin = horaFinHora * 60 + horaFinMinuto

    // La hora de fin debe ser posterior a la hora de inicio
    return minutosFin > minutosInicio
  }

  validarFecha(fecha: Date): boolean {
    // Verificar que sea una fecha válida y no sea anterior a hoy
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    return fecha instanceof Date && !isNaN(fecha.getTime()) && fecha >= hoy
  }
}
