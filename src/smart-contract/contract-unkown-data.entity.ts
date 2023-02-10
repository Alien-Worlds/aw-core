import { ContractDataEntity } from './contract-data.entity';

export class ContractUnkownDataEntity implements ContractDataEntity {
  public static create(data: unknown) {
    return new ContractUnkownDataEntity(data);
  }

  protected constructor(private data: unknown) {}

  public toDocument(): unknown {
    return this.data;
  }
  public toStruct(): unknown {
    return this.data;
  }
}
