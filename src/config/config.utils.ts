import { readFileSync } from 'fs';
import path from 'path';
import { log } from '../utils';

/**
 * Regular expression pattern to match and capture key-value pairs in an env file line.
 * @constant {RegExp}
 */
const LINE =
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;

/**
 * Parses the contents of an env file buffer or string and returns an object representing the key-value pairs.
 * @param {Buffer|string} buffer - The env file buffer or string to parse.
 * @returns {object} An object representing the key-value pairs parsed from the env file.
 * @template Environment - The type of the resulting object representing the key-value pairs.
 */
export const parseEnvFile = <Environment = object>(
  buffer: Buffer | string
): Environment => {
  const obj = {};

  let lines = buffer.toString();

  lines = lines.replace(/\r\n?/gm, '\n');

  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1];
    let value = match[2] || '';

    value = value.trim();
    const maybeQuote = value[0];

    value = value.replace(/^(['"`])([\s\S]*)\1$/gm, '$2');
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n');
      value = value.replace(/\\r/g, '\r');
    }
    obj[key] = value;
  }

  return obj as Environment;
};

/**
 * Reads and parses the contents of an env file and returns an object representing the key-value pairs.
 * @param {string} [envPath] - The path to the env file. If not provided, it defaults to '.env' in the current working directory.
 * @returns {object} An object representing the key-value pairs parsed from the env file.
 * @template Environment - The type of the resulting object representing the key-value pairs.
 */
export const readEnvFile = <Environment = object>(envPath?: string): Environment => {
  try {
    const env = parseEnvFile(
      readFileSync(envPath || path.resolve(process.cwd(), '.env'), { encoding: 'utf8' })
    );
    return env as Environment;
  } catch (error) {
    log(error);
    return {} as Environment;
  }
};
