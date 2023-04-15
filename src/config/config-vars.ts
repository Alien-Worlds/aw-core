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
    return Number(this.getEnv(name));
  }

  public getStringEnv(name: string): string {
    return String(this.getEnv(name));
  }

  public getBooleanEnv(name: string): boolean {
    return Boolean(this.getNumberEnv(name));
  }

  public getArrayEnv(name: string): string[] {
    return (this.getStringEnv(name) || '').split(/,\s*/);
  }
}
