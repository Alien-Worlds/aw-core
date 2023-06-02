/**
 * @abstract
 * Represents a mapper that converts between the EntityType and the DocumentType.
 * EntityType is the domain entity type used in the business logic layer.
 * DocumentType is the document type used in the database layer.
 */
export abstract class Mapper<EntityType = unknown, DocumentType = unknown> {
  /**
   * Converts a document from the database layer to a domain entity.
   *
   * @param {DocumentType} document The document from the database layer.
   *
   * @returns {EntityType} The domain entity.
   *
   * @abstract
   */
  public abstract toEntity(document: DocumentType): EntityType;

  /**
   * Converts a domain entity from the business logic layer to a database document.
   *
   * @param {EntityType} entity The domain entity from the business logic layer.
   *
   * @returns {DocumentType} The document for the database layer.
   *
   * @abstract
   */
  public abstract fromEntity(entity: EntityType): DocumentType;
}
