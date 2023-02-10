import { Entity } from '../architecture/domain/entity';

export abstract class ContractDataEntity<DocumentType = unknown, StructType = unknown>
  implements Entity<DocumentType>
{
  public abstract toDocument(): DocumentType;
  public abstract toStruct(): StructType;
}
