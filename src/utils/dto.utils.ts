/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/**
 * Remove undefined properties and empty objects.
 * Mainly used when creating DTOs to send to a data source.
 *
 * @param {unknown} input
 * @returns {unknown}
 */
export const removeUndefinedProperties = <T>(input: unknown): T => {
  const output = Array.isArray(input) ? [] : {};
  for (const key of Object.keys(input)) {
    const value = input[key];

    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      output[key] = removeUndefinedProperties(value);
      continue;
    }

    if (value.constructor.name === 'Object') {
      const cleared = removeUndefinedProperties(value);
      output[key] = cleared;
      continue;
    }

    output[key] = value;
  }
  return output as T;
};

/**
 *
 * @param {unknown} value
 * @returns {bigint}
 */
export const parseToBigInt = (value: unknown): bigint => {
  // MongoDB.Long instance
  if (value['toBigInt']) {
    return value['toBigInt']();
  }
  return BigInt(value as string | number | bigint | boolean);
};

/**
 * @param {Uint8Array} buffer
 * @returns {BigInt}
 */
export const parseUint8ArrayToBigInt = (buffer: Uint8Array): bigint => {
  const hex = [];

  buffer.forEach(function (i) {
    let h = i.toString(16);
    if (h.length % 2) {
      h = '0' + h;
    }
    hex.push(h);
  });

  return BigInt('0x' + hex.join(''));
};
