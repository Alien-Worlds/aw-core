export const log = (...args: unknown[]) => {
  if (!process.env.NO_LOGS || Number(process.env.NO_LOGS) === 0) {
    console.log(`process:${process.pid} | `, ...args);
  }
};
