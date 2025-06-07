import type { Request, Response, NextFunction } from "express"
import { VerificarToken } from "../../application/useCases/auth/VerificarToken"
import { AuthService } from "../../infrastructure/services/AuthService"
import { AuthenticationException } from "../../core/exceptions/index"

// Extender la interfaz Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number
        email: string
        tipo: string
      }
    }
  }
}

const authService = new AuthService()
const verificarTokenUseCase = new VerificarToken(authService)

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token de acceso requerido" })
  }

  try {
    const payload = verificarTokenUseCase.execute(token)
    req.user = payload
    next()
  } catch (error) {
    if (error instanceof AuthenticationException) {
      return res.status(401).json({ error: error.message })
    }
    return res.status(403).json({ error: "Token inválido" })
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  if (req.user.tipo !== "admin") {
    return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador" })
  }

  next()
}

export const requireOwnershipOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuario no autenticado" })
  }

  const resourceUserId = Number.parseInt(req.params.userId || req.body.usuario_id)

  if (req.user.tipo === "admin" || req.user.userId === resourceUserId) {
    next()
  } else {
    res.status(403).json({ error: "Acceso denegado. Solo puedes acceder a tus propios recursos" })
  }
}
