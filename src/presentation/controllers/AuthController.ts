import type { Request, Response } from "express"
import  { LoginUsuario } from "../../application/useCases/auth/LoginUsuario"
import  { RegistrarUsuario } from "../../application/useCases/usuarios/RegistrarUsuario"
import {BusinessRuleException,AuthenticationException, ValidationException } from "../../core/exceptions/index"

export class AuthController {
  constructor(
    private loginUsuarioUseCase: LoginUsuario,
    private registrarUsuarioUseCase: RegistrarUsuario,
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({ error: "Email y contraseña son requeridos" })
        return
      }

      const resultado = await this.loginUsuarioUseCase.execute({ email, password })
      res.status(200).json(resultado)
    } catch (error) {
      if (error instanceof ValidationException) {
        res.status(400).json({ error: error.message })
      } else if (error instanceof AuthenticationException) {
        res.status(401).json({ error: error.message })
      } else {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, email, password, tipo } = req.body

      if (!nombre || !email || !password) {
        res.status(400).json({ error: "Nombre, email y contraseña son requeridos" })
        return
      }

      const resultado = await this.registrarUsuarioUseCase.execute({
        nombre,
        email,
        password,
        tipo: tipo || "usuario",
      })

      res.status(201).json(resultado)
    } catch (error) {
      if (error instanceof ValidationException) {
        res.status(400).json({ error: error.message })
      } else if (error instanceof BusinessRuleException) {
        res.status(409).json({ error: error.message })
      } else {
        console.error(error)
        res.status(500).json({ error: "Error interno del servidor" })
      }
    }
  }
}
