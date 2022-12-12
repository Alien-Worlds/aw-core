export const isEosRpcSource = (item: unknown): boolean => {
    return item['getTableRows'] && item['getContractStats'];
  }
  