/**
 * Suspends execution of the current process for a given number of milliseconds
 * @async
 * @param {number} ms
 * @returns {Promise}
 */
export const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const log = (...args: unknown[]) => {
  if (!process.env.NO_LOGS || Number(process.env.NO_LOGS) === 0) {
    console.log(`process:${process.pid} | ${new Date().toISOString()} ::`, ...args);
  }
};