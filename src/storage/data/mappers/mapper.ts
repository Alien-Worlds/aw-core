export abstract class Mapper<EntityType, DocumentType> {
  public abstract createEntityFromDocument<T = EntityType>(document: DocumentType): T;
  public abstract createDocumentFromEntity(entity: EntityType): DocumentType;
}
