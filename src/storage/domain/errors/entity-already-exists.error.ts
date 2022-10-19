export class EntityAlreadyExistsError extends Error {
  constructor() {
    super(`Entity already exists.`);
  }
}
