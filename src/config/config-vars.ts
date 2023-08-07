import { readEnvFile } from './config.utils';

/**
 * Represents a configuration variables class that provides access to environment variables and values from a .env file.
 * @class
 */
export class ConfigVars {
  private dotEnv;

  /**
   * Constructs a new instance of ConfigVars.
   * @param {string} [envPath] - The path to the .env file.
   */
  constructor(envPath?: string) {
    this.dotEnv = readEnvFile(envPath);
  }

  /**
   * Retrieves the value of an environment variable or a variable from the .env file.
   * @private
   * @param {string} name - The name of the environment variable.
   * @returns {unknown} The value of the environment variable.
   */
  private getEnv(name: string): unknown {
    return process.env[name] || this.dotEnv[name];
  }

  /**
   * Retrieves the value of an environment variable as a number.
   * @public
   * @param {string} name - The name of the environment variable.
   * @returns {number} The value of the environment variable as a number. Returns NaN if the value cannot be converted to a number.
   */
  public getNumberEnv(name: string): number {
    const env = this.getStringEnv(name);
    return env ? Number(env) : NaN;
  }

  /**
   * Retrieves the value of an environment variable as a string.
   * @public
   * @param {string} name - The name of the environment variable.
   * @returns {string} The value of the environment variable as a string. Returns an empty string if the value is not defined.
   */
  public getStringEnv(name: string): string {
    const env = this.getEnv(name);
    return env ? String(env) : '';
  }

  /**
   * Retrieves the value of an environment variable as a boolean.
   * @public
   * @param {string} name - The name of the environment variable.
   * @returns {boolean | null} The value of the environment variable as a boolean. Returns null if the value cannot be converted to a boolean.
   */
  public getBooleanEnv(name: string): boolean {
    const stringEnv = this.getStringEnv(name);

    if (stringEnv === 'true') {
      return true;
    }

    if (stringEnv === 'false') {
      return false;
    }

    const env = this.getNumberEnv(name);

    return Number.isNaN(env) ? null : Boolean(env);
  }

  /**
   * Retrieves the value of an environment variable as an array of strings.
   * @public
   * @param {string} name - The name of the environment variable.
   * @returns {string[]} The value of the environment variable as an array of strings. Returns an empty array if the value is not defined or cannot be split into an array.
   */
  public getArrayEnv(name: string): string[] {
    const env = this.getStringEnv(name) || '';
    return env ? env.split(/,\s*/) : [];
  }
}
