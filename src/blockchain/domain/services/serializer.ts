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
  public abstract deserialize(
    value: Uint8Array,
    type?: string,
    types?: Map<string, unknown>,
    ...args: unknown[]
  ): Type;

  /**
   * Converts given hex string to Uint8Array.
   *
   * @abstract
   * @param {string} value - The value to be serialized.
   * @returns {Uint8Array} The serialized value as Uint8Array.
   */
  public abstract hexToUint8Array(value: string): Uint8Array;
}
