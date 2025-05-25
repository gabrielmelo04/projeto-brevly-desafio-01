
export class ShortLinkNotFoundError extends Error {
  constructor() {
    super('Link(s) encurtado(s) não encontrado(s).');
  }
}