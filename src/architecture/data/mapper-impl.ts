/* eslint-disable @typescript-eslint/no-unused-vars */
import { MissingKeyMappingsError } from '../domain/errors';
import { Mapper, PropertyMapping } from './mapper';

/**
 * Represents a mapper that converts between the EntityType and the DocumentType.
 * EntityType is the domain entity type used in the business logic layer.
 * DocumentType is the document type used in the database layer.
 */
export class MapperImpl<EntityType = unknown, ModelType = unknown>
  implements Mapper<EntityType, ModelType>
{
  protected readonly mappingFromEntity = new Map<string, PropertyMapping>();
  /**
   * Converts a document from the database layer to a domain entity.
   *
   * @param {ModelType} model The document from the database layer.
   * @returns {EntityType} The domain entity.
   */
  public toEntity(model: ModelType): EntityType {
    throw new Error('Method not implemented.');
  }

  /**
   * Converts a domain entity from the business logic layer to a database document.
   *
   * @param {EntityType} entity The domain entity from the business logic layer.
   * @returns {ModelType} The document for the database layer.
   */
  public fromEntity(entity: EntityType): ModelType {
    const missingMappings: string[] = [];
    const model = {};

    Object.keys(entity).forEach(key => {
      const mapping = this.mappingFromEntity.get(key);
      if (mapping) {
        model[mapping.key] = mapping.mapper(entity[key]);
      } else {
        missingMappings.push(key);
      }
    });
    if (missingMappings.length > 0) {
      throw new MissingKeyMappingsError(missingMappings);
    }
    return model as ModelType;
  }

  /**
   * Gets entity key mapping based on the provided key.
   *
   *
   * @param {string} key - The key for which to get the entity key mapping.
   * @returns {PropertyMapping} The mapping associated with the provided key.
   */
  public getEntityKeyMapping(key: string): PropertyMapping {
    return this.mappingFromEntity.get(key);
  }
}
