export class EntityNotFoundError extends Error {
  constructor(collection: string) {
    super(`Entity not found in collection "${collection}".`);
  }
}
