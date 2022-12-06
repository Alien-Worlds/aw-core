/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { SqlQueryType } from './sql.enums';

export const stringifyMultiCondition = <T = unknown>(
  operator: string,
  key: string,
  data: T[]
): string => {
  const result: string[] = [];
  data.reduce((list: string[], current) => {
    if (current[key]) {
      list.push(`${key} = ${current[key]}`);
    }
    return list;
  }, result);

  return result.join(` ${operator} `);
};

export const stringifyData = <T = unknown>(data: T, key?: string): string => {
  if (key && data[key]) {
    return `${key} = ${data[key]}`;
  }

  const result: unknown[] = Object.keys(data).reduce(
    (list: unknown[], current: string) => {
      const value = data[current];
      list.push(`${current} = ${String(value)}`);

      return list;
    },
    []
  );

  return result.join(', ');
};

export const buildSqlQuery = (
  type: SqlQueryType,
  table: string,
  data: unknown[],
  params?: {
    where?: string;
    keys?: string[];
    limit?: number;
    offset?: number;
  }
): string => {
  const where = params?.where ? ` WHERE ${params.where}` : '';
  const limit = params?.limit ? ` LIMIT ${params.limit}` : '';
  const offset = params?.offset ? ` OFFSET ${params.offset}` : '';
  const keys = params?.keys ? ` ${params.keys.join(', ')}` : '*';

  if (type === SqlQueryType.Select) {
    return `SELECT ${keys} FROM ${table}${where}${limit}${offset}`;
  } else if (type === SqlQueryType.Count) {
    return `SELECT COUNT(*) AS total_rows FROM ${table}${where}`;
  } else if (type === SqlQueryType.Update) {
    return `UPDATE ${table} SET ${stringifyData(data[0])}${where}`;
  } else if (type === SqlQueryType.Delete) {
    return `DELETE FROM ${table}${where}`;
  } else if (type === SqlQueryType.Insert) {
    // TODO: write more parsers object, date etc.
    const values = data.map(item => {
      const valuesStr = Object.values(item)
        .map(value => (typeof value === 'string' ? `"${value}"` : value))
        .join(', ');
      return `(${valuesStr})`;
    });

    return `INSERT INTO ${table} (${Object.keys(data[0]).join(
      ', '
    )}) VALUES ${values.join(', ')}`;
  }
};
