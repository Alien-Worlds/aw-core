import { readEnvFile } from './config.utils';

export class ConfigVars {
  private dotEnv;

  constructor(envPath?: string) {
    this.dotEnv = readEnvFile(envPath);
  }

  private getEnv(name: string): unknown {
    return process.env[name] || this.dotEnv[name];
  }

  public getNumberEnv(name: string): number {
    const env = this.getStringEnv(name);
    return env ? Number(env) : NaN;
  }

  public getStringEnv(name: string): string {
    const env = this.getEnv(name);
    return env ? String(env) : '';
  }

  public getBooleanEnv(name: string): boolean {
    const env = this.getNumberEnv(name);
    return env ? Boolean(env) : null;
  }

  public getArrayEnv(name: string): string[] {
    return (this.getStringEnv(name) || '').split(/,\s*/);
  }
}
