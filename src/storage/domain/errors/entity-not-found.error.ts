export class EntityNotFoundError extends Error {
  constructor(collection: string) {
    super(`Entity assigned to "${collection}" not found.`);
  }
}
