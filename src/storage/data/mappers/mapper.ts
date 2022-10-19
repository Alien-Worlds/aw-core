export abstract class Mapper<DefaultEntityType, DefaultDocumentType> {
  public abstract createEntityFromDocument<
    EntityType = DefaultEntityType,
    DocumentType = DefaultDocumentType
  >(document: DocumentType): EntityType;
  public abstract createDocumentFromEntity<
    EntityType = DefaultEntityType,
    DocumentType = DefaultDocumentType
  >(entity: EntityType): DocumentType;
}
