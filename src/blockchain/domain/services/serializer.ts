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
   * @param {string} value - The hexadecimal representation of the data.
   * @returns {Type} The deserialized action data.
   */
  public abstract deserializeAction<T = Type>(
    contract: string,
    action: string,
    data: Uint8Array,
    value: string,
    ...args: unknown[]
  ): T;

  /**
   * Deserializes the table data for a specific contract and table.
   *
   * @param {string} contract - The contract associated with the table.
   * @param {string} table - The table name.
   * @param {Uint8Array} data - The raw data to be deserialized.
   * @param {string} value - The hexadecimal representation of the data.
   * @returns {Type} The deserialized table data.
   */
  public abstract deserializeTable<T = Type>(
    contract: string,
    table: string,
    data: Uint8Array,
    value: string,
    ...args: unknown[]
  ): T;

  /**
   * Converts given hex string to Uint8Array.
   *
   * @abstract
   * @param {string} value - The value to be serialized.
   * @returns {Uint8Array} The serialized value as Uint8Array.
   */
  public abstract hexToUint8Array(value: string): Uint8Array;
}
