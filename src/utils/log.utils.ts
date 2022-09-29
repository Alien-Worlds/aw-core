export const log = (...args: unknown[]) =>
  console.log(`process:${process.pid} | `, ...args);
