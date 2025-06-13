import { VerificarDisponibilidadEspacio } from "../src/application/useCases/espacios/VerificarDisponibilidad"
import { BusinessRuleException } from "../src/core/exceptions/index"
import type { Espacio } from "../src/core/entities/Espacio"
import type { Reserva } from "../src/core/entities/Reserva"

// Mocks de repositorios
const mockEspacioRepository = {
  findById: jest.fn(),
  verificarDisponibilidad: jest.fn(),
  findAll: jest.fn(),
  findByTipo: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

const mockReservaRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  findByUsuarioId: jest.fn(),
  findByEspacioId: jest.fn(),
  findByFecha: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findConflictingReservations: jest.fn(),
}

describe("VerificarDisponibilidadEspacio", () => {
  let verificarDisponibilidadUseCase: VerificarDisponibilidadEspacio

  // Datos de prueba
  const espacioMock: Espacio = {
    id: 1,
    nombre: "Salón de Prueba",
    tipo: "salon",
    capacidad: 50,
    disponible: true,
  }

  const reservaMock: Reserva = {
    id: 1,
    usuario_id: 5,
    espacio_id: 1,
    fecha: new Date("2025-06-16"),
    hora_inicio: "10:00",
    hora_fin: "12:00",
    estado: "confirmada",
  }

  // Reserva que SÍ conflicta con el horario de prueba
  const reservaConflictivaMock: Reserva = {
    id: 2,
    usuario_id: 6,
    espacio_id: 1,
    fecha: new Date("2025-06-16"),
    hora_inicio: "13:00", // Conflicta con 14:00-16:00
    hora_fin: "15:00",   // Conflicta con 14:00-16:00
    estado: "confirmada",
  }

  const requestMock = {
    espacio_id: 1,
    fecha: "2025-06-16",
    hora_inicio: "14:00",
    hora_fin: "16:00",
  }

  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks()

    // Inicializar el caso de uso con los repositorios mock
    verificarDisponibilidadUseCase = new VerificarDisponibilidadEspacio(mockEspacioRepository, mockReservaRepository)
  })

  it("debería verificar correctamente un espacio disponible", async () => {
    // Arrange - Configurar los mocks para simular un espacio disponible
    mockEspacioRepository.findById.mockResolvedValue(espacioMock)
    mockEspacioRepository.verificarDisponibilidad.mockResolvedValue(true)
    mockReservaRepository.findByFecha.mockResolvedValue([reservaMock])

    // Act - Ejecutar el caso de uso
    const resultado = await verificarDisponibilidadUseCase.execute(requestMock)

    // Assert - Verificar el resultado
    expect(resultado.disponible).toBe(true)
    expect(resultado.espacio.id).toBe(espacioMock.id)
    expect(resultado.espacio.nombre).toBe(espacioMock.nombre)
    expect(resultado.fecha).toBe(requestMock.fecha)
    expect(resultado.hora_inicio).toBe(requestMock.hora_inicio)
    expect(resultado.hora_fin).toBe(requestMock.hora_fin)
    expect(resultado.conflictos).toBeUndefined()

    // Verificar que se llamaron los métodos correctos
    expect(mockEspacioRepository.findById).toHaveBeenCalledWith(requestMock.espacio_id)
    expect(mockEspacioRepository.verificarDisponibilidad).toHaveBeenCalledWith(
      requestMock.espacio_id,
      expect.any(Date),
      requestMock.hora_inicio,
      requestMock.hora_fin,
    )
    expect(mockReservaRepository.findByFecha).toHaveBeenCalledWith(expect.any(Date))
  })

  it("debería mostrar conflictos cuando el espacio no está disponible", async () => {
    // Arrange - Configurar los mocks para simular un espacio no disponible
    // Usar una reserva que SÍ conflicta con el horario
    mockEspacioRepository.findById.mockResolvedValue(espacioMock)
    mockEspacioRepository.verificarDisponibilidad.mockResolvedValue(false)
    mockReservaRepository.findByFecha.mockResolvedValue([reservaConflictivaMock])

    // Act - Ejecutar el caso de uso
    const resultado = await verificarDisponibilidadUseCase.execute(requestMock)

    // Assert - Verificar el resultado
    expect(resultado.disponible).toBe(false)
    expect(resultado.conflictos).toBeDefined()
    expect(resultado.conflictos?.length).toBe(1)
    expect(resultado.conflictos?.[0].id).toBe(reservaConflictivaMock.id)
    expect(resultado.conflictos?.[0].hora_inicio).toBe("13:00")
    expect(resultado.conflictos?.[0].hora_fin).toBe("15:00")
    expect(resultado.conflictos?.[0].usuario).toBe("Usuario 6")
  })

  it("debería lanzar una excepción cuando el espacio no existe", async () => {
    // Arrange - Configurar el mock para simular que el espacio no existe
    mockEspacioRepository.findById.mockResolvedValue(null)

    // Act & Assert - Verificar que se lanza la excepción esperada
    await expect(verificarDisponibilidadUseCase.execute(requestMock)).rejects.toThrow(BusinessRuleException)
    await expect(verificarDisponibilidadUseCase.execute(requestMock)).rejects.toThrow("El espacio no existe")

    // Verificar que se llamó al método correcto
    expect(mockEspacioRepository.findById).toHaveBeenCalledWith(requestMock.espacio_id)
    expect(mockEspacioRepository.verificarDisponibilidad).not.toHaveBeenCalled()
  })

  it("debería retornar conflictos vacíos cuando no hay reservas conflictivas", async () => {
    // Arrange - Espacio no disponible pero sin reservas conflictivas
    mockEspacioRepository.findById.mockResolvedValue(espacioMock)
    mockEspacioRepository.verificarDisponibilidad.mockResolvedValue(false)
    mockReservaRepository.findByFecha.mockResolvedValue([])

    // Act
    const resultado = await verificarDisponibilidadUseCase.execute(requestMock)

    // Assert
    expect(resultado.disponible).toBe(false)
    expect(resultado.conflictos).toBeDefined()
    expect(resultado.conflictos?.length).toBe(0)
  })

  it("debería filtrar reservas canceladas de los conflictos", async () => {
    // Arrange
    const reservaCancelada: Reserva = {
      id: 3,
      usuario_id: 7,
      espacio_id: 1,
      fecha: new Date("2025-06-16"),
      hora_inicio: "14:30",
      hora_fin: "15:30",
      estado: "cancelada", // Estado cancelada
    }

    mockEspacioRepository.findById.mockResolvedValue(espacioMock)
    mockEspacioRepository.verificarDisponibilidad.mockResolvedValue(false)
    mockReservaRepository.findByFecha.mockResolvedValue([reservaCancelada, reservaConflictivaMock])

    // Act
    const resultado = await verificarDisponibilidadUseCase.execute(requestMock)

    // Assert - Solo debe mostrar la reserva confirmada, no la cancelada
    expect(resultado.disponible).toBe(false)
    expect(resultado.conflictos?.length).toBe(1)
    expect(resultado.conflictos?.[0].id).toBe(reservaConflictivaMock.id)
  })
})