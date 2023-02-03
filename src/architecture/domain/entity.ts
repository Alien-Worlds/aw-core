/**
 * @abstract
 * @class
 */
export abstract class Entity<DocumentType = unknown> {
  public abstract toDocument(): DocumentType;
}
