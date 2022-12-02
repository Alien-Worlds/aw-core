import { Result } from '../../../architecture';
import { GetTableRowsOptions } from '../../data/data-sources/eos-rpc.source';

/**
 * Represents a base class for the smart contracts -set by tables- repositories.
 *
 * @class
 */
export abstract class SmartContractRepository<EntityType> {
  public abstract getMany(options: GetTableRowsOptions): Promise<Result<EntityType[]>>;
  public abstract getOne(options: GetTableRowsOptions): Promise<Result<EntityType>>;
}
