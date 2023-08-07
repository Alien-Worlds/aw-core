import { UnknownObject } from '../types';
import { WhereOperator } from './where.enums';

/**
 * This class represents a Group operation in a query. It allows for
 * specifying fields to group by and aggregations to perform on each group.
 *
 * @template Type The type of the object the group applies to.
 */
export class Group<Type = UnknownObject> {
  private groupBy: keyof Type | Array<keyof Type> = null;
  private aggregations: { [key: string]: WhereOperator } = {};

  /**
   * Specifies the field(s) to group by.
   *
   * @param {keyof Type | Array<keyof Type>} fields - The field or fields to group by.
   * @returns {Group} The current Group instance for chaining.
   */
  public by(fields: keyof Type | Array<keyof Type>): this {
    this.groupBy = fields;
    return this;
  }

  /**
   * Adds an aggregation to perform on the group.
   *
   * @param {keyof Type} field - The field to perform the aggregation on.
   * @param {WhereOperator} operator - The aggregation operator to apply.
   * @returns {Group} The current Group instance for chaining.
   */
  public addAggregation(field: keyof Type, operator: WhereOperator): this {
    this.aggregations[String(field)] = operator;
    return this;
  }

  /**
   * Gets the raw representation of the group operation.
   *
   * @returns {{groupBy: keyof Type | Array<keyof Type>; aggregations: { [key: string]: WhereOperator };}}
   * The raw group operation.
   */
  public getRaw(): {
    groupBy: keyof Type | Array<keyof Type>;
    aggregations: { [key: string]: WhereOperator };
  } {
    return {
      groupBy: this.groupBy,
      aggregations: this.aggregations,
    };
  }
}
