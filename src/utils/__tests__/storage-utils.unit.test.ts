/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { containsSpecialKeys } from '../storage.utils';

describe('"Storage Utils" unit tests', () => {
  it('"containsSpecialKeys" should return true when given object contains special (operator) keys', () => {
    expect(containsSpecialKeys({ $max: 'foo', bar: 'baz' })).toBeTruthy();
  });

  it('"containsSpecialKeys" should return false when given object does not contain special (operator) keys', () => {
    expect(containsSpecialKeys({ foo: 'foo', bar: 'baz' })).toBeFalsy();
  });

  it('"containsSpecialKeys" should return false when given data is not an object', () => {
    try {
      containsSpecialKeys('');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });
});
