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

export const writeSocketBuffer = (message: BroadcastTcpMessage): Buffer => {
  const buffer = message.toBuffer();
  const size = Buffer.alloc(2);
  size.writeUInt16BE(buffer.length);
  return Buffer.concat([size, buffer]);
};

export const splitToMessageBuffers = (buffer: Buffer): Buffer[] => {
  const buffers: Buffer[] = [];
  if (buffer.length > 2) {
    let offset = 0;
    while (offset < buffer.length) {
      const head = buffer.subarray(offset, offset + 2);
      const buffSize = head.readUInt16BE(0);
      const buffStart = offset + 2;
      const buffEnd = buffStart + buffSize;
      buffers.push(buffer.subarray(buffStart, buffEnd));
      offset = buffEnd;
    }
  }

  return buffers;
};

export const getClientAddress = (
  { remoteAddress, remotePort, localAddress, localPort }: Socket,
  local: boolean
) => (local ? `${localAddress}:${localPort}` : `${remoteAddress}:${remotePort}`);
