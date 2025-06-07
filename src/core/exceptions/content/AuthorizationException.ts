import { DomainException } from "./DomainException"

export class AuthorizationException extends DomainException {
  constructor(message: string) {
    super(message)
    this.name = "AuthorizationException"
  }
}
