import { DomainException } from "./DomainException"

export class AuthenticationException extends DomainException {
  constructor(message: string) {
    super(message)
    this.name = "AuthenticationException"
  }
}
