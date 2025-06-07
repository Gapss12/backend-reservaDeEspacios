import type { Request, Response, NextFunction } from "express"
import { DomainException, ValidationException, BusinessRuleException, 
         AuthenticationException,AuthorizationException } from "../../core/exceptions/index"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)

  if (err instanceof ValidationException) {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
    })
  }

  if (err instanceof AuthenticationException) {
    return res.status(401).json({
      error: "Authentication Error",
      message: err.message,
    })
  }

  if (err instanceof AuthorizationException) {
    return res.status(403).json({
      error: "Authorization Error",
      message: err.message,
    })
  }

  if (err instanceof BusinessRuleException) {
    return res.status(409).json({
      error: "Business Rule Error",
      message: err.message,
    })
  }

  if (err instanceof DomainException) {
    return res.status(400).json({
      error: "Domain Error",
      message: err.message,
    })
  }

  return res.status(500).json({
    error: "Internal Server Error",
    message: "Ha ocurrido un error inesperado",
  })
}
