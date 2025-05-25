

export class InvalidShortLink extends Error {
  constructor() {
    super('Link encurtado inválido.');
  }
}