export class SmartContractDataNotFoundError extends Error {
  constructor(data: { bound?: string, scope?: string, table?: string }) {
    const { bound, scope, table } = data;
    super(`Data with ${bound} in scope: '${scope}' table: '${table}' scope not found`);
  }
}
