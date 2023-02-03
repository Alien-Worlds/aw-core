export abstract class Mapper<EntityType = unknown, DtoType = unknown> {
  public abstract toEntity(dto: DtoType): EntityType;
  public abstract toDataObject(entity: EntityType): DtoType;
}
