import { UnknownObject } from './types';

/**
 * Represents the available operators for the Where clause.
 * @enum {number}
 */
export enum WhereOperator {
  is,
  isEq,
  isNotEq,
  isLt,
  isLte,
  isGt,
  isGte,
  isInRange,
  isNotInRange,
  isIn,
  isNotIn,
  isNoneOf,
  isTrue,
  isFalse,
  is0,
  is1,
  isNull,
  isNotNull,
  isEmpty,
  isNotEmpty,
  and,
  or,
}

/**
 * Represents a single Where clause.
 * @typedef {Object} WhereClause
 * @property {WhereOperator} operator - The operator for the clause.
 * @property {unknown} value - The value for the clause.
 */
export type WhereClause = { operator: WhereOperator; value: unknown };
/**
 * Represents a chain of Where clauses.
 * @typedef {Object} WhereChain
 * @property {string} key - The key for the current WhereClause.
 * @property {WhereClause} value - The single WhereClause.
 */
export type WhereChain = { [key: string]: WhereClause };

/**
 * Represents a class for constructing Where clauses.
 * @class
 */
export class Where {
  /**
   * Creates a new Where instance with the provided raw object.
   * @static
   * @param {UnknownObject} raw - The raw (data source related) conditions object to initialize the Where instance.
   * @returns {Where} A new instance of the Where class.
   */
  public static is(raw: UnknownObject) {
    const where = new Where(raw);
    return where;
  }

  /**
   * Creates an 'AND' condition for a group of Where clauses.
   * @static
   * @param {Where[]} clauses - The array of Where clauses to combine with 'AND'.
   * @returns {Object} The 'AND' condition for the group of Where clauses.
   */
  public static and(clauses: Array<Where>) {
    return { and: clauses };
  }

  /**
   * Creates an 'OR' condition for a group of Where clauses.
   * @static
   * @param {Where[]} clauses - The array of Where clauses to combine with 'OR'.
   * @returns {Object} The 'OR' condition for the group of Where clauses.
   */
  public static or(clauses: Array<Where>) {
    return { or: clauses };
  }

  private currentKey: string;

  /**
   * Constructs a new instance of the Where class.
   * @param {UnknownObject} [chain] - The raw object to initialize the Where instance.
   * @param {UnknownObject} [raw] - The raw object to initialize the Where instance.
   */
  constructor(private raw: UnknownObject = null, private chain: WhereChain = {}) {}

  /**
   * Sets the key for the current Where clause.
   * @param {string} key - The key for the current Where clause.
   * @returns {Where} The current instance of the Where class.
   */
  public valueOf(key: string): Where {
    this.currentKey = key;
    return this;
  }

  /**
   * Retrieves the result of the Where clauses as a raw object.
   * @type {UnknownObject}
   */
  public get result() {
    const { raw, chain } = this;
    return raw ? { ...raw } : { ...chain };
  }

  /**
   * Adds an 'isEq' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isEq' condition.
   */
  public isEq(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.isEq, value };
    return this;
  }

  /**
   * Adds an 'isIn' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isIn' condition.
   */
  public isIn(value: Array<unknown>) {
    this.chain[this.currentKey] = { operator: WhereOperator.isIn, value };
    return this;
  }

  /**
   * Adds an 'isNotEq' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isNotEq' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotEq(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.isNotEq, value };
    return this;
  }

  /**
   * Adds an 'isLt' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isLt' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isLt(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.isLt, value };
    return this;
  }

  /**
   * Adds an 'isLte' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isLte' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isLte(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.isLte, value };
    return this;
  }

  /**
   * Adds an 'isGt' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isGt' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isGt(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.isGt, value };
    return this;
  }

  /**
   * Adds an 'isGte' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isGte' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isGte(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.isGte, value };
    return this;
  }

  /**
   * Adds an 'isInRange' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isInRange' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isInRange(value: Array<unknown>) {
    this.chain[this.currentKey] = { operator: WhereOperator.isInRange, value };
    return this;
  }

  /**
   * Adds an 'isNotInRange' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isNotInRange' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotInRange(value: Array<unknown>) {
    this.chain[this.currentKey] = { operator: WhereOperator.isNotInRange, value };
    return this;
  }

  /**
   * Adds an 'isNotIn' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isNotIn' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotIn(value: Array<unknown>) {
    this.chain[this.currentKey] = { operator: WhereOperator.isNotIn, value };
    return this;
  }

  /**
   * Adds an 'isNoneOf' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isNoneOf' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNoneOf(value: Array<unknown>) {
    this.chain[this.currentKey] = { operator: WhereOperator.isNoneOf, value };
    return this;
  }

  /**
   * Adds an 'isTrue' condition to the current Where clause.
   * @returns {Where} The current instance of the Where class.
   */
  public isTrue() {
    this.chain[this.currentKey] = { operator: WhereOperator.isTrue, value: true };
    return this;
  }

  /**
   * Adds an 'isFalse' condition to the current Where clause.
   * @returns {Where} The current instance of the Where class.
   */
  public isFalse() {
    this.chain[this.currentKey] = { operator: WhereOperator.isFalse, value: false };
    return this;
  }

  /**
   * Adds an 'is0' condition to the current Where clause.
   * @param {unknown} value - The value for the 'is0' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public is0(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.is0, value };
    return this;
  }

  /**
   * Adds an 'is1' condition to the current Where clause.
   * @param {unknown} value - The value for the 'is1' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public is1(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.is1, value };
    return this;
  }

  /**
   * Adds an 'isNull' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isNull' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNull(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.isNull, value };
    return this;
  }

  /**
   * Adds an 'isNotNull' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isNotNull' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotNull(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.isNotNull, value };
    return this;
  }

  /**
   * Adds an 'isEmpty' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isEmpty' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isEmpty(value: unknown) {
    this.chain[this.currentKey] = { operator: WhereOperator.isEmpty, value };
    return this;
  }

  /**
   * Adds an 'isNotEmpty' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isNotEmpty' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotEmpty(value: unknown) {
    this.chain[this.currentKey] = {
      operator: WhereOperator.isNotEmpty,
      value,
    };
    return this;
  }
}
