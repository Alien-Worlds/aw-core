import { UnknownObject } from '../../../architecture';

export type Row = {
  present: boolean;
  data: Uint8Array;
  [key: string]: unknown;
};

export type TableRow<DataType = unknown> = {
  code: string;
  scope: string;
  table: string;
  primary_key: string;
  payer: string;
  present: boolean;
  data: DataType;
  [key: string]: unknown;
};

/**
 * Abstract class for serialization and deserialization.
 * @template Type - The type of the serialized/deserialized value.
 */
export abstract class Serializer {
  /**
   * Method to deserialize ABI from hexadecimal representation.
   *
   * @async
   * @param {string} hex - The hexadecimal representation of the ABI.
   * @returns {Promise<AbiType>} The deserialized ABI.
   */
  public abstract getAbiFromHex<AbiType>(hex: string): Promise<AbiType>;

  /**
   * Method to convert ABI to hexadecimal string.
   *
   * @async
   * @param {AbiType} abi - The ABI object.
   * @returns {Promise<string>} The ABI hex string.
   */
  public abstract getHexFromAbi<AbiType>(abi: AbiType): Promise<string>;

  /**
   * Method to get types from provided ABI.
   *
   * @async
   * @param {Abi} abi
   * @returns {Promise<Map<string, Type>>}
   */
  public abstract getTypesFromAbi<Type>(abi: UnknownObject): Promise<Map<string, Type>>;

  /**
   * Serializes a value to Uint8Array based on the given type.
   *
   * @async
   * @abstract
   * @param {unknown} value - The value to be serialized.
   * @param {string} type - The type of the value to be serialized.
   * @param {Map<string, unknown>} types - The map of available types for serialization.
   * @param {...unknown[]} args - Additional arguments for serialization if needed.
   * @returns {Promise<Uint8Array>} The serialized value as Uint8Array.
   */
  public abstract serialize(
    value: unknown,
    type?: string,
    types?: Map<string, unknown>,
    ...args: unknown[]
  ): Promise<Uint8Array>;

  /**
   * Deserializes a value from Uint8Array based on the given type.
   *
   * @async
   * @abstract
   * @param {Uint8Array} value - The value to be deserialized as Uint8Array.
   * @param {string} type - The type of the value to be deserialized.
   * @param {Map<string, unknown>} types - The map of available types for deserialization.
   * @param {...unknown[]} args - Additional arguments for deserialization if needed.
   * @returns {Promise<ReturnType>} The deserialized value.
   */
  public abstract deserialize<ReturnType = [string, UnknownObject]>(
    value: Uint8Array,
    type?: string,
    types?: Map<string, unknown>,
    ...args: unknown[]
  ): Promise<ReturnType>;

  /**
   * Deserializes the action data for a specific account and action.
   *
   * @async
   * @param {string} contract - The contract associated with the action.
   * @param {string} action - The action name.
   * @param {Uint8Array} data - The raw data to be deserialized.
   * @param {string | UnknownObject} abi - ABI in the form of a hexadecimal string or as an object. If the ABI is not given then any internal Uint8Array will not be parsed.
   * @returns {Promise<ReturnType>} The deserialized action data.
   */
  public abstract deserializeActionData<ReturnType = UnknownObject>(
    contract: string,
    action: string,
    data: Uint8Array,
    abi: string | UnknownObject,
    ...args: unknown[]
  ): Promise<ReturnType>;

  /**
   * Deserializes the table row.
   *
   * @async
   * @param {Uint8Array} row - The raw row to be deserialized.
   * @param {string | UnknownObject} abi - ABI in the form of a hexadecimal string or as an object. If the ABI is not given then any internal Uint8Array will not be parsed.
   * @returns {Promise<TableRow<DataType | Uint8Array>>} The deserialized table data.
   */
  public abstract deserializeTableRow<DataType = UnknownObject>(
    row: Row,
    abi?: string | UnknownObject,
    ...args: unknown[]
  ): Promise<TableRow<DataType | Uint8Array>>;

  /**
   * Deserializes a table delta for a specific table.
   *
   * @async
   * @param {string} table - The table name.
   * @param {Uint8Array} data - The raw data to be deserialized.
   * @param {string | UnknownObject} abi - ABI in the form of a hexadecimal string or as an object. If the ABI is not given then any internal Uint8Array will not be parsed.
   * @returns {Promise<ReturnType>} The deserialized table delta.
   */
  public abstract deserializeTableRowData<ReturnType = UnknownObject>(
    table: string,
    data: Uint8Array,
    abi: string | UnknownObject,
    ...args: unknown[]
  ): Promise<ReturnType>;

  /**
   * Deserializes a transaction for a specific contract.
   *
   * @async
   * @param {string} contract - The contract associated with the transaction.
   * @param {Uint8Array} data - The raw data to be deserialized.
   * @param {string | UnknownObject} abi - ABI in the form of a hexadecimal string or as an object. If the ABI is not given then any internal Uint8Array will not be parsed.
   * @returns {Promise<ReturnType>} The deserialized transaction.
   */
  public abstract deserializeTransaction<ReturnType = UnknownObject>(
    contract: string,
    data: Uint8Array,
    abi?: string | UnknownObject,
    ...args: unknown[]
  ): Promise<ReturnType>;

  /**
   * Deserializes a block.
   *
   * @async
   * @param {DataType} data - The raw data to be deserialized. Default Uint8Array.
   * @param {string | UnknownObject} abi - ABI in the form of a hexadecimal string or as an object. If the ABI is not given then any internal Uint8Array will not be parsed.
   * @returns {Promise<ReturnType>} The deserialized block.
   */
  public abstract deserializeBlock<ReturnType = UnknownObject, DataType = Uint8Array>(
    data: DataType,
    abi?: string | UnknownObject,
    ...args: unknown[]
  ): Promise<ReturnType>;

  /**
   * Converts a hexadecimal string to Uint8Array.
   *
   * @async
   * @abstract
   * @param {string} value - The hexadecimal value to be converted.
   * @returns {Promise<Uint8Array>} The converted value as Uint8Array.
   */
  public abstract hexToUint8Array(value: string): Promise<Uint8Array>;

  /**
   * Converts a Uint8Array to a hexadecimal string.
   *
   * @async
   * @abstract
   * @param {Uint8Array} value - The Uint8Array value to be converted.
   * @returns {Promise<string>} The converted value as a hexadecimal string.
   */
  public abstract uint8ArrayToHex(value: Uint8Array): Promise<string>;
}
