export class SmartContractDataNotFoundError extends Error {
  constructor(data: { bound?: string, lower_bound?: string, upper_bound?: string, scope?: string, table?: string }) {
    const { bound, upper_bound, lower_bound, scope, table } = data;
    super(`Data with ${bound || upper_bound || lower_bound} in scope: '${scope}' table: '${table}' scope not found`);
  }
}
