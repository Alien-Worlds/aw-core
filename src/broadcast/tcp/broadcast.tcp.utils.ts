import { Socket } from 'net';
import { BroadcastConnectionConfig } from '../broadcast.types';
import { BroadcastTcpMessage } from './broadcast.tcp.message';

export const getTcpConnectionOptions = (config: BroadcastConnectionConfig) => {
  const { url, host, port } = config;

  if (url) {
    return { path: url };
  } else if (host || port) {
    return { host, port };
  } else {
    throw new Error('Wrong TCP connection options');
  }
};

const HEADER_SIZE = 4;

export const writeSocketBuffer = (message: BroadcastTcpMessage): Buffer => {
  const buffer = message.toBuffer();
  const size = Buffer.alloc(HEADER_SIZE);
  size.writeUInt32BE(buffer.length);
  return Buffer.concat([size, buffer]);
};

export const splitToMessageBuffers = (buffer: Buffer): Buffer[] => {
  const buffers: Buffer[] = [];
  let offset = 0;
  let remainingBytes = null;

  while (offset < buffer.length) {
    if (remainingBytes === null) {
      // Need to read the size of the next message
      if (offset + 4 <= buffer.length) {
        // We have enough bytes to read the size
        remainingBytes = buffer.readUInt32BE(offset);
        offset += 4;
      } else {
        // Not enough bytes yet, wait for the next data chunk
        break;
      }
    } else {
      // Reading the payload of a message
      if (offset + remainingBytes <= buffer.length) {
        // We have enough bytes to read the entire message
        const messageBuffer = buffer.subarray(offset, offset + remainingBytes);
        buffers.push(messageBuffer);
        remainingBytes = null;
        offset += messageBuffer.length;
      } else {
        // Not enough bytes yet, wait for the next data chunk
        break;
      }
    }
  }

  return buffers;
};

export const getClientAddress = (
  { remoteAddress, remotePort, localAddress, localPort }: Socket,
  local: boolean
) => (local ? `${localAddress}:${localPort}` : `${remoteAddress}:${remotePort}`);
