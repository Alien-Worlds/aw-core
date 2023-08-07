import { ConfigVars } from '../config-vars';

describe('ConfigVars', () => {
  beforeEach(() => {
    process.env.TEST_STRING = 'test string';
    process.env.TEST_NUMBER = '42';
    process.env.TEST_BOOLEAN = 'true';
    process.env.TEST_BOOLEAN_ONE = '1';
    process.env.TEST_BOOLEAN_ZERO = '0';
    process.env.TEST_ARRAY = 'value1, value2, value3';
  });

  afterEach(() => {
    delete process.env.TEST_STRING;
    delete process.env.TEST_NUMBER;
    delete process.env.TEST_BOOLEAN;
    delete process.env.TEST_BOOLEAN_ONE;
    delete process.env.TEST_BOOLEAN_ZERO;
    delete process.env.TEST_ARRAY;
  });

  describe('getStringEnv', () => {
    it('should return the value of a string environment variable', () => {
      const configVars = new ConfigVars();
      const value = configVars.getStringEnv('TEST_STRING');
      expect(value).toBe('test string');
    });

    it('should return an empty string if the environment variable is not defined', () => {
      const configVars = new ConfigVars();
      const value = configVars.getStringEnv('UNDEFINED_VARIABLE');
      expect(value).toBe('');
    });
  });

  describe('getNumberEnv', () => {
    it('should return the value of a number environment variable', () => {
      const configVars = new ConfigVars();
      const value = configVars.getNumberEnv('TEST_NUMBER');
      expect(value).toBe(42);
    });

    it('should return NaN if the value of the environment variable is not a number', () => {
      const configVars = new ConfigVars();
      const value = configVars.getNumberEnv('TEST_STRING');
      expect(value).toBeNaN();
    });

    it('should return NaN if the environment variable is not defined', () => {
      const configVars = new ConfigVars();
      const value = configVars.getNumberEnv('UNDEFINED_VARIABLE');
      expect(value).toBeNaN();
    });
  });

  describe('getBooleanEnv', () => {
    it('should return the value of a boolean environment variable', () => {
      const configVars = new ConfigVars();
      expect(configVars.getBooleanEnv('TEST_BOOLEAN')).toBe(true);
      expect(configVars.getBooleanEnv('TEST_BOOLEAN_ONE')).toBe(true);
      expect(configVars.getBooleanEnv('TEST_BOOLEAN_ZERO')).toBe(false);
    });

    it('should return null if the value of the environment variable cannot be converted to a boolean', () => {
      const configVars = new ConfigVars();
      const value = configVars.getBooleanEnv('UNDEFINED_VARIABLE');
      expect(value).toBeNull();
    });

    it('should return null if the environment variable is not defined', () => {
      const configVars = new ConfigVars();
      const value = configVars.getBooleanEnv('UNDEFINED_VARIABLE');
      expect(value).toBeNull();
    });
  });

  describe('getArrayEnv', () => {
    it('should return the value of an array environment variable', () => {
      const configVars = new ConfigVars();
      const value = configVars.getArrayEnv('TEST_ARRAY');
      expect(value).toEqual(['value1', 'value2', 'value3']);
    });

    it('should return an empty array if the environment variable is not defined', () => {
      const configVars = new ConfigVars();
      const value = configVars.getArrayEnv('UNDEFINED_VARIABLE');
      expect(value).toEqual([]);
    });
  });
});
