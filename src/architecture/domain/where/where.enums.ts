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
  isBetween,
}
