import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import type { IAuthService } from "../../core/interfaces/services/IAuthService"

export class AuthService implements IAuthService {
  private readonly jwtSecret: string
  private readonly saltRounds: number = 10

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key-change-in-production"
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds)
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  generateToken(userId: number, email: string, tipo: string): string {
    const payload = {
      userId,
      email,
      tipo,
    }

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: "24h",
    })
  }

  verifyToken(token: string): { userId: number; email: string; tipo: string } | null {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as any
      return {
        userId: payload.userId,
        email: payload.email,
        tipo: payload.tipo,
      }
    } catch (error) {
      return null
    }
  }
}
