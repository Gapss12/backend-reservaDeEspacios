import { CrearReserva } from '../src/application/useCases/reservas/CrearReserva';
import { ValidationException, BusinessRuleException } from '../src/core/exceptions/index';

describe('CrearReserva', () => {
  // Mocks de las dependencias
  const mockReservaRepository = {
    create: jest.fn(),
    findById: jest.fn(),
  };
  
  const mockEspacioRepository = {
    findById: jest.fn(),
  };
  
  const mockUsuarioRepository = {
    findById: jest.fn(),
  };
  
  const mockEmailService = {
    enviarConfirmacionReserva: jest.fn(),
  };
  
  const mockValidationService = {
    validarFecha: jest.fn(),
    validarHorario: jest.fn(),
  };

  const mockValidarDisponibilidadReserva = {
    execute: jest.fn(),
  };

  // Crear instancia del caso de uso antes de cada test
  let crearReservaUseCase: CrearReserva;

  beforeEach(() => {
    jest.clearAllMocks();
    crearReservaUseCase = new CrearReserva(
      mockReservaRepository as any,
      mockEspacioRepository as any,
      mockUsuarioRepository as any,
      mockEmailService as any,
      mockValidationService as any,
      mockValidarDisponibilidadReserva as any
    );
  });

  // Tests específicos
  describe('validaciones', () => {
    test('debe lanzar ValidationException si la fecha es inválida', async () => {
      // Arrange
      const request = {
        usuario_id: 1,
        espacio_id: 1,
        fecha: '2025-06-13',
        hora_inicio: '09:00',
        hora_fin: '10:00'
      };
      mockValidationService.validarFecha.mockReturnValue(false);

      // Act & Assert
      await expect(crearReservaUseCase.execute(request))
        .rejects
        .toThrow(ValidationException);
    });

    test('debe lanzar ValidationException si el horario es inválido', async () => {
      // Arrange
      const request = {
        usuario_id: 1,
        espacio_id: 1,
        fecha: '2025-06-13',
        hora_inicio: '09:00',
        hora_fin: '10:00'
      };
      mockValidationService.validarFecha.mockReturnValue(true);
      mockValidationService.validarHorario.mockReturnValue(false);

      // Act & Assert
      await expect(crearReservaUseCase.execute(request))
        .rejects
        .toThrow(ValidationException);
    });
  });

  describe('verificación de existencia', () => {
    test('debe lanzar BusinessRuleException si el usuario no existe', async () => {
      // Arrange
      const request = {
        usuario_id: 1,
        espacio_id: 1,
        fecha: '2025-06-13',
        hora_inicio: '09:00',
        hora_fin: '10:00'
      };
      mockValidationService.validarFecha.mockReturnValue(true);
      mockValidationService.validarHorario.mockReturnValue(true);
      mockUsuarioRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(crearReservaUseCase.execute(request))
        .rejects
        .toThrow(BusinessRuleException);
    });

    test('debe lanzar BusinessRuleException si el espacio no existe', async () => {
      // Arrange
      const request = {
        usuario_id: 1,
        espacio_id: 1,
        fecha: '2025-06-13',
        hora_inicio: '09:00',
        hora_fin: '10:00'
      };
      mockValidationService.validarFecha.mockReturnValue(true);
      mockValidationService.validarHorario.mockReturnValue(true);
      mockUsuarioRepository.findById.mockResolvedValue({ id: 1, nombre: 'Usuario' });
      mockEspacioRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(crearReservaUseCase.execute(request))
        .rejects
        .toThrow(BusinessRuleException);
    });
  });

  describe('creación exitosa', () => {
    test('debe crear una reserva y enviar email cuando todo es válido', async () => {
      // Arrange
      const request = {
        usuario_id: 1,
        espacio_id: 1,
        fecha: '2025-06-13',
        hora_inicio: '09:00',
        hora_fin: '10:00'
      };
      
      const mockUsuario = { id: 1, nombre: 'Usuario', email: 'test@test.com' };
      const mockEspacio = { id: 1, nombre: 'Espacio' };
      const mockReserva = { ...request, id: 1, estado: 'pendiente' };

      mockValidationService.validarFecha.mockReturnValue(true);
      mockValidationService.validarHorario.mockReturnValue(true);
      mockUsuarioRepository.findById.mockResolvedValue(mockUsuario);
      mockEspacioRepository.findById.mockResolvedValue(mockEspacio);
      mockValidarDisponibilidadReserva.execute.mockResolvedValue(true);
      mockReservaRepository.create.mockResolvedValue(mockReserva);

      // Act
      const result = await crearReservaUseCase.execute(request);

      // Assert
      expect(result).toBeDefined();
      expect(mockEmailService.enviarConfirmacionReserva).toHaveBeenCalled();
      expect(mockReservaRepository.create).toHaveBeenCalled();
    });
  });
});