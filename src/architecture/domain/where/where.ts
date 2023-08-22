/* eslint-disable @typescript-eslint/no-empty-function */
import { UnknownObject } from '../types';
import { Group } from './group';
import { WhereOperator } from './where.enums';
import { WhereChain } from './where.types';

/**
 * Type that maps properties of T to Where<T>.
 * @template T - Any type.
 */
type PropertyChecker<T> = {
  [K in keyof T]: Where<T>;
};

/**
 * Function to assert input is a PropertyChecker<T>.
 * @param input - The object to assert.
 * @template T - Any type.
 * @throws {TypeError} If input is not a PropertyChecker<T>.
 */
function asPropertyChecker<T>(input: unknown): asserts input is PropertyChecker<T> {}

/**
 * Represents a class for constructing Where clauses.
 * @class
 */
export class Where<Type = UnknownObject> {
  /**
   * Represents the key identifier used for retrieving records based on keys.
   * Primarily used in WHERE clauses or equivalent constructs in various Where parsers.
   *
   * @static
   * @type {string}
   * @default '__get_by_keys__'
   */
  public static KEYS = '__get_by_keys__';

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

  public static bind<Type = UnknownObject>() {
    const where = new Where<Type>();
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

  /**
   * The key for the current Where clause.
   * @type {string|null}
   */
  private currentKey: string | null = null;
  /**
   * The Proxy object to get properties of the bound type.
   * @type {PropertyChecker<Type>}
   */
  private proxyObject: PropertyChecker<Type>;

  /**
   * This array stores Group instances that represent group operations
   * in the query. It starts as an empty array.
   *
   * @type {Group[]}
   * @private
   */
  private groups: Group[] = [];

  /**
   * Constructs a new instance of the Where class.
   * @param {UnknownObject} [chain] - The raw object to initialize the Where instance.
   * @param {UnknownObject} [raw] - The raw object to initialize the Where instance.
   */
  constructor(private raw: UnknownObject = null, private chain: WhereChain = {}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.proxyObject = new Proxy<any>(
      {},
      {
        get: (_target, prop: string) => {
          this.currentKey = prop;
          return this;
        },
      }
    );
    asPropertyChecker<Type>(this.proxyObject);
  }

  /**
   * Provides access to the keys of the bound type.
   * @returns {PropertyChecker<Type>} The keys of the bound type.
   */
  public prototype(): PropertyChecker<Type> {
    return this.proxyObject;
  }

  /**
   * Performs an operation on records based on the provided keys.
   *
   * @public
   * @param {string[]} list - An array of keys to specify the records.
   */
  public keys(list: string[]) {
    this.setClause(Where.KEYS, NaN, list);
  }

  /**
   * Adds the Where clause to the key.
   *
   * @param {string} key - The key for the current Where clause.
   * @param {number} operator - The Where clause operator.
   * @param {number} value - The value for the condition.
   * @returns {Where} The current instance of the Where class.
   */
  private setClause(key: string, operator: number, value: unknown) {
    if (!this.chain[key]) {
      this.chain[key] = [];
    }

    this.chain[key].push({ operator, value });
    return this;
  }

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
    const { raw, chain, groups } = this;
    return raw ? { ...raw } : { ...chain, groups };
  }

  /**
   * @type {Boolean}
   */
  public get isRaw() {
    return this.raw !== null;
  }

  /**
   * Adds an 'isBetween' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isBetween' condition.
   */
  public isBetween(first: unknown, last: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isBetween, [first, last]);
  }

  /**
   * Adds an 'isEq' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isEq' condition.
   */
  public isEq(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isEq, value);
  }

  /**
   * Adds an 'isIn' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isIn' condition.
   */
  public isIn(value: Array<unknown>) {
    return this.setClause(this.currentKey, WhereOperator.isIn, value);
  }

  /**
   * Adds an 'isNotEq' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isNotEq' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotEq(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isNotEq, value);
  }

  /**
   * Adds an 'isLt' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isLt' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isLt(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isLt, value);
  }

  /**
   * Adds an 'isLte' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isLte' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isLte(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isLte, value);
  }

  /**
   * Adds an 'isGt' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isGt' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isGt(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isGt, value);
  }

  /**
   * Adds an 'isGte' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isGte' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isGte(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isGte, value);
  }

  /**
   * Adds an 'isInRange' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isInRange' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isInRange(value: Array<unknown>) {
    return this.setClause(this.currentKey, WhereOperator.isInRange, value);
  }

  /**
   * Adds an 'isNotInRange' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isNotInRange' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotInRange(value: Array<unknown>) {
    return this.setClause(this.currentKey, WhereOperator.isNotInRange, value);
  }

  /**
   * Adds an 'isNotIn' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isNotIn' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotIn(value: Array<unknown>) {
    return this.setClause(this.currentKey, WhereOperator.isNotIn, value);
  }

  /**
   * Adds an 'isNoneOf' condition to the current Where clause.
   * @param {unknown[]} value - The value for the 'isNoneOf' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNoneOf(value: Array<unknown>) {
    return this.setClause(this.currentKey, WhereOperator.isNoneOf, value);
  }

  /**
   * Adds an 'isTrue' condition to the current Where clause.
   * @returns {Where} The current instance of the Where class.
   */
  public isTrue() {
    return this.setClause(this.currentKey, WhereOperator.isTrue, true);
  }

  /**
   * Adds an 'isFalse' condition to the current Where clause.
   * @returns {Where} The current instance of the Where class.
   */
  public isFalse() {
    return this.setClause(this.currentKey, WhereOperator.isFalse, false);
  }

  /**
   * Adds an 'is0' condition to the current Where clause.
   * @param {unknown} value - The value for the 'is0' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public is0(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.is0, value);
  }

  /**
   * Adds an 'is1' condition to the current Where clause.
   * @param {unknown} value - The value for the 'is1' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public is1(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.is1, value);
  }

  /**
   * Adds an 'isNull' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isNull' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNull(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isNull, value);
  }

  /**
   * Adds an 'isNotNull' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isNotNull' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotNull(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isNotNull, value);
  }

  /**
   * Adds an 'isEmpty' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isEmpty' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isEmpty(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isEmpty, value);
  }

  /**
   * Adds an 'isNotEmpty' condition to the current Where clause.
   * @param {unknown} value - The value for the 'isNotEmpty' condition.
   * @returns {Where} The current instance of the Where class.
   */
  public isNotEmpty(value: unknown) {
    return this.setClause(this.currentKey, WhereOperator.isNotEmpty, value);
  }

  /**
   * Adds a Group instance to the list of group operations in the query.
   *
   * @param {Group} group - The Group instance to add.
   * @returns {this} The current class instance for chaining.
   * @public
   */
  public group(group: Group) {
    this.groups.push(group);
    return this;
  }

  // TODO: implement "and", "or"
}
