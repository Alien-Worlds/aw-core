/* eslint-disable @typescript-eslint/no-unused-vars */
import { UnknownObject } from './types';

/**
 * Represents an abstract Entity class.
 * @abstract
 * @template JsonType - The type of the JSON representation of the entity.
 * @template RestType - The type of additional properties in the entity.
 */
export abstract class Entity<JsonType = UnknownObject, RestType = UnknownObject> {
  /**
   * Returns the default instance of the entity.
   * @static
   * @template EntityType - The type of the entity.
   * @returns {EntityType} The default instance of the entity.
   * @throws {Error} The static method getDefault() is not implemented.
   */
  public static getDefault<EntityType = Entity>(): EntityType {
    throw new Error('Static method getDefault() not implemented.');
  }

  /**
   * The unique identifier of the entity.
   * @type {string}
   */
  public id?: string;

  /**
   * Additional properties of the entity.
   * @type {RestType | undefined}
   */
  public rest?: RestType;

  /**
   * Converts the entity to its JSON representation.
   * @abstract
   * @returns {JsonType} The JSON representation of the entity.
   */
  public abstract toJSON(): JsonType;
}
