

export class EntityNotFoundError extends Error {
  constructor(collection: string) {
    super(`Entity assigned to "${collection}" not found.`);
  }
}

export class UpdateOneError extends Error {
  constructor() {
    super(`Document not updated`);
  }
}

export class MissingArgumentsError extends Error {
  constructor(...names: string[]) {
    super(`Missing arguments [${names.join(',')}] to execute the command`);
  }
}

export class CustomIndexesNotSetError extends Error {
  constructor(collection: string) {
    super(`No additional indexes were created in collection "${collection}".`);
  }
}
