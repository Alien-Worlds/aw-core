export type ConsumerOptions = {
  consumerTag?: string | undefined;
  noLocal?: boolean | undefined;
  noAck?: boolean | undefined;
  exclusive?: boolean | undefined;
  priority?: number | undefined;
  arguments?: unknown;
};
