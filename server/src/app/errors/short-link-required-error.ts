

export class ShortLinkRequiredError extends Error {
  constructor() {
    super('Link encurtado obrigatório.');
  }
}