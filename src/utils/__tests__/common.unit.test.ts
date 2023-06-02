import { log, wait } from '../common.utils';

describe('wait', () => {
  it('should wait for the specified amount of time', async () => {
    const startTime = Date.now();
    const waitTime = 1000; // milliseconds

    await wait(waitTime);

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    expect(elapsedTime).toBeGreaterThanOrEqual(waitTime);
  });
});

describe('log', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should log the provided arguments if NO_LOGS environment variable is not set', () => {
    const args = ['Hello', 'World'];

    log(...args);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('process:'),
      ...args
    );
  });

  it('should not log the provided arguments if NO_LOGS environment variable is set', () => {
    const args = ['Hello', 'World'];
    process.env.NO_LOGS = '1';

    log(...args);

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
