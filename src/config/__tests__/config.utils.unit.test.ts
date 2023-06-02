import { parseEnvFile, readEnvFile } from '../config.utils';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('path');

describe('parseEnvFile', () => {
  it('should parse the contents of an env file buffer', () => {
    const buffer = Buffer.from('KEY1=value1\nKEY2=value2\n');
    const result = parseEnvFile(buffer);
    expect(result).toEqual({ KEY1: 'value1', KEY2: 'value2' });
  });

  it('should parse the contents of an env file string', () => {
    const contents = 'KEY1=value1\nKEY2=value2\n';
    const result = parseEnvFile(contents);
    expect(result).toEqual({ KEY1: 'value1', KEY2: 'value2' });
  });

  it('should handle empty lines and comments in the env file', () => {
    const contents = 'KEY1=value1\n\n# Comment\nKEY2=value2\n';
    const result = parseEnvFile(contents);
    expect(result).toEqual({ KEY1: 'value1', KEY2: 'value2' });
  });

  it('should handle single and double quoted values in the env file', () => {
    const contents = `KEY1='value1'\nKEY2="value2"\n`;
    const result = parseEnvFile(contents);
    expect(result).toEqual({ KEY1: 'value1', KEY2: 'value2' });
  });

  it('should expand newlines in double quoted values', () => {
    const contents = 'MULTILINE="Line1\\nLine2\\nLine3"\n';
    const result = parseEnvFile(contents);
    expect(result).toEqual({ MULTILINE: 'Line1\nLine2\nLine3' });
  });

  it('should handle empty values in the env file', () => {
    const contents = 'KEY1=\nKEY2=\n';
    const result = parseEnvFile(contents);
    expect(result).toEqual({ KEY1: '', KEY2: '' });
  });

  it('should trim whitespace from key-value pairs', () => {
    const contents = '  KEY1 = value1  \n';
    const result = parseEnvFile(contents);
    expect(result).toEqual({ KEY1: 'value1' });
  });
});

const readFileSyncMock = jest
  .spyOn(fs, 'readFileSync')
  .mockReturnValue('KEY1=value1\nKEY2=value2\n');

describe('readEnvFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should read and parse the contents of the default env file', () => {
    const readFileSyncMock = jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue('KEY1=value1\nKEY2=value2\n');

    const resolveMock = jest.spyOn(path, 'resolve').mockReturnValue('/path/to/.env');

    const result = readEnvFile();
    expect(result).toEqual({ KEY1: 'value1', KEY2: 'value2' });
    expect(readFileSyncMock).toHaveBeenCalledWith('/path/to/.env', { encoding: 'utf8' });
    expect(resolveMock).toHaveBeenCalledWith(process.cwd(), '.env');
  });

  it('should read and parse the contents of a specified env file', () => {
    const readFileSyncMock = jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue('KEY1=value1\nKEY2=value2\n');

    const result = readEnvFile('/path/to/.env.test');
    expect(result).toEqual({ KEY1: 'value1', KEY2: 'value2' });
    expect(readFileSyncMock).toHaveBeenCalledWith('/path/to/.env.test', {
      encoding: 'utf8',
    });
  });

  it('should return an empty object if the env file does not exist', () => {
    const readFileSyncMock = jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File not found');
    });

    const result = readEnvFile('/path/to/nonexistent.env');
    expect(result).toEqual({});
    expect(readFileSyncMock).toHaveBeenCalledWith('/path/to/nonexistent.env', {
      encoding: 'utf8',
    });
  });
});
