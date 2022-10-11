export abstract class Mapper<EntityType, DocumentType> {
    public abstract createEntityFromDocument(document: DocumentType): EntityType;
    public abstract createDocumentFromEntity(entity: EntityType): DocumentType;
}