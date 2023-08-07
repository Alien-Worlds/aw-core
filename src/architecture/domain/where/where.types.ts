import { WhereOperator } from "./where.enums";


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
export type WhereChain = { [key: string]: WhereClause[] };
