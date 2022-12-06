export abstract class Mapper<EntityType, DtoType> {
  public abstract toEntity(dto: DtoType): EntityType;
  public abstract toDataObject(entity: EntityType): DtoType;
}
