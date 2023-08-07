export class EntityNotFoundError extends Error {
  constructor(collection: string) {
    super(`Entity not found in collection "${collection}".`);
  }
}

export class MissingKeyMappingsError extends Error {
  constructor(keys: string[]) {
    super(`Some keys [${keys.join(', ')}] do not have mappers assigned to them.`);
  }
}

export class UnsupportedOperatorError extends Error {
  constructor(operator: string) {
    super(`Unsupported operator "${operator}".`);
  }
}
