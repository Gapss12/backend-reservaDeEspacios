import type { IAuthService } from "../../../core/interfaces/services/IAuthService"
import { AuthenticationException } from "../../../core/exceptions/index"

export class VerificarToken {
  constructor(private authService: IAuthService) {}

  execute(token: string): { userId: number; email: string; tipo: string } {
    const payload = this.authService.verifyToken(token)

    if (!payload) {
      throw new AuthenticationException("Token inválido o expirado")
    }

    return payload
  }
}
