import { 
  AuthenticationException, 
  AuthorizationException, 
  BusinessRuleException,
  ValidationException,
  DomainException 
} from "../src/core/exceptions/index"

describe("Exceptions", () => {
  
  describe("AuthenticationException", () => {
    it("debería crear una excepción de autenticación correctamente", () => {
      const message = "Credenciales inválidas"
      const exception = new AuthenticationException(message)
      
      expect(exception.message).toBe(message)
      expect(exception.name).toBe("AuthenticationException")
      expect(exception).toBeInstanceOf(DomainException)
      expect(exception).toBeInstanceOf(Error)
    })

    it("debería poder ser lanzada y capturada", () => {
      const message = "Token expirado"
      
      expect(() => {
        throw new AuthenticationException(message)
      }).toThrow(AuthenticationException)
      
      expect(() => {
        throw new AuthenticationException(message)
      }).toThrow(message)
    })
  })

  describe("AuthorizationException", () => {
    it("debería crear una excepción de autorización correctamente", () => {
      const message = "Acceso denegado"
      const exception = new AuthorizationException(message)
      
      expect(exception.message).toBe(message)
      expect(exception.name).toBe("AuthorizationException")
      expect(exception).toBeInstanceOf(DomainException)
      expect(exception).toBeInstanceOf(Error)
    })

    it("debería poder ser lanzada y capturada", () => {
      const message = "Permisos insuficientes"
      
      expect(() => {
        throw new AuthorizationException(message)
      }).toThrow(AuthorizationException)
      
      expect(() => {
        throw new AuthorizationException(message)
      }).toThrow(message)
    })
  })

  describe("BusinessRuleException", () => {
    it("debería crear una excepción de regla de negocio correctamente", () => {
      const message = "El espacio no existe"
      const exception = new BusinessRuleException(message)
      
      expect(exception.message).toBe(message)
      expect(exception.name).toBe("BusinessRuleException")
      expect(exception).toBeInstanceOf(DomainException)
      expect(exception).toBeInstanceOf(Error)
    })
  })

  describe("ValidationException", () => {
    it("debería crear una excepción de validación correctamente", () => {
      const message = "Datos inválidos"
      const exception = new ValidationException(message)
      
      expect(exception.message).toBe(message)
      expect(exception.name).toBe("ValidationException")
      expect(exception).toBeInstanceOf(DomainException)
      expect(exception).toBeInstanceOf(Error)
    })
  })

  describe("DomainException", () => {
    it("debería crear una excepción de dominio base correctamente", () => {
      const message = "Error de dominio"
      const exception = new DomainException(message)
      
      expect(exception.message).toBe(message)
      expect(exception.name).toBe("DomainException")
      expect(exception).toBeInstanceOf(Error)
    })
  })
})