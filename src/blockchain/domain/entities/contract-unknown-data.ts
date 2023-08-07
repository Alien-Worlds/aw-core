import { Entity } from '../../../architecture';
import { UnknownObject } from '../../../architecture/domain/types';

/**
 * ContractUnknownData represents contract data for which there is no processor or known types defined in the history tools components.
 * This can occur when a new contract version is released, but the history tools are using a different version and have no types defined for the new version.
 *
 * @class
 */
export class ContractUnknownData implements Entity {
  /**
   * Creates an instance of ContractUnknownData.
   *
   * @param {UnknownObject} data - The unknown data object to be stored in the entity.
   * @returns {ContractUnknownData} The created instance of ContractUnknownData.
   */
  public static create(data: UnknownObject) {
    return new ContractUnknownData(data);
  }

  /**
   * Creates an instance of ContractUnknownData.
   *
   * @protected
   * @param {UnknownObject} data - The unknown data object to be stored in the entity.
   */
  protected constructor(private data: UnknownObject) {}
  /**
   * The identifier of the contract unknown data entity.
   * Note: This property is not required but has to be added as it is required in the Entity interface.
   *
   * @type {string}
   */
  public id: string;

  /**
   * Converts the contract unknown data to a JSON object.
   *
   * @returns {UnknownObject} The contract unknown data as a JSON object.
   */
  public toJSON(): UnknownObject {
    const { data } = this;
    return { ...data };
  }
}
