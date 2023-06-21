import { UnknownObject } from '../../../architecture';

export type ContractTable<DataType = unknown> = {
  code: string;
  scope: string;
  table: string;
  primaryKey: string;
  payer: string;
  data: DataType;
};

/**
 * Abstract class for serialization and deserialization.
 * @template Type - The type of the serialized/deserialized value.
 */
export abstract class Serializer<Type = [string, { [key: string]: unknown }]> {
  /**
   * Serializes a value to Uint8Array based on the given type.
   * @abstract
   * @param {unknown} value - The value to be serialized.
   * @param {string} type - The type of the value to be serialized.
   * @param {Map<string, unknown>} types - The map of available types for serialization.
   * @param {...unknown[]} args - Additional arguments for serialization if needed.
   * @returns {Uint8Array} The serialized value as Uint8Array.
   */
  public abstract serialize(
    value: unknown,
    type?: string,
    types?: Map<string, unknown>,
    ...args: unknown[]
  ): Uint8Array;

  /**
   * Deserializes a value from Uint8Array based on the given type.
   * @abstract
   * @param {Uint8Array} value - The value to be deserialized as Uint8Array.
   * @param {string} type - The type of the value to be deserialized.
   * @param {Map<string, unknown>} types - The map of available types for deserialization.
   * @param {...unknown[]} args - Additional arguments for deserialization if needed.
   * @returns {Type} The deserialized value.
   */
  public abstract deserialize<T = Type>(
    value: Uint8Array,
    type?: string,
    types?: Map<string, unknown>,
    ...args: unknown[]
  ): T;

  /**
   * Deserializes the action data for a specific account and action.
   *
   * @param {string} contract - The contract associated with the action.
   * @param {string} action - The action name.
   * @param {Uint8Array} data - The raw data to be deserialized.
   * @param {string | UnknownObject} abi - The hexadecimal representation of the abi or raw object.
   * @returns {Type} The deserialized action data.
   */
  public abstract deserializeActionData<T = Type>(
    contract: string,
    action: string,
    data: Uint8Array,
    abi: string | UnknownObject,
    ...args: unknown[]
  ): T;

  /**
   * Deserializes the table.
   *
   * @param {Uint8Array} data - The raw data to be deserialized.
   * @param {string | UnknownObject} abi - The hexadecimal representation of the abi or raw object.
   * @returns {ContractTable<Type>} The deserialized table data.
   */
  public abstract deserializeTable<T = Type>(
    data: Uint8Array,
    abi?: string | UnknownObject,
    ...args: unknown[]
  ): ContractTable<T | Uint8Array>;

  /**
   * Deserializes a table delta for a specific table.
   *
   * @param {string} table - The table name.
   * @param {Uint8Array} data - The raw data to be deserialized.
   * @param {string | UnknownObject} abi - The hexadecimal representation of the abi or raw object.
   * @returns {Type} The deserialized table delta.
   */
  public abstract deserializeTableDelta<T = UnknownObject>(
    table: string,
    data: Uint8Array,
    abi: string | UnknownObject,
    ...args: unknown[]
  ): T;

  /**
   * Deserializes a transaction for a specific contract.
   *
   * @param {string} contract - The contract associated with the transaction.
   * @param {Uint8Array} data - The raw data to be deserialized.
   * @param {string | UnknownObject} abi - The hexadecimal representation of the abi or raw object.
   * @returns {Type} The deserialized transaction.
   */
  public abstract deserializeTransaction<T = Type>(
    contract: string,
    data: Uint8Array,
    abi?: string | UnknownObject,
    ...args: unknown[]
  ): T;

  /**
   * Converts a hexadecimal string to Uint8Array.
   *
   * @abstract
   * @param {string} value - The hexadecimal value to be converted.
   * @returns {Uint8Array} The converted value as Uint8Array.
   */
  public abstract hexToUint8Array(value: string): Uint8Array;

  /**
   * Converts a Uint8Array to a hexadecimal string.
   *
   * @abstract
   * @param {Uint8Array} value - The Uint8Array value to be converted.
   * @returns {string} The converted value as a hexadecimal string.
   */
  public abstract uint8ArrayToHex(value: Uint8Array): string;
}
