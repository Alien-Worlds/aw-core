import { GetTableRowsOptions } from "../../data/data-sources/eos-rpc.source";

/**
 * Represents a base class for the smart contracts -set by tables- repositories.
 *
 * @class
 */
export abstract class SmartContractRepository<DtoType> {
  
  /**
   * @async
   * @param {GetTableRowsOptions} options
   * @returns {Promise<DtoType>}
   */
  protected abstract getOneRow(options: GetTableRowsOptions): Promise<DtoType[]>;

  /**
   * @async
   * @param {GetTableRowsOptions} options
   * @returns {Promise<DtoType>}
   */
  protected abstract getRows(options: GetTableRowsOptions): Promise<DtoType[]>;
}
