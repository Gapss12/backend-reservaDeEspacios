export interface IAuthService {
  hashPassword(password: string): Promise<string>
  comparePassword(password: string, hashedPassword: string): Promise<boolean>
  generateToken(userId: number, email: string, tipo: string): string
  verifyToken(token: string): { userId: number; email: string; tipo: string } | null
}
