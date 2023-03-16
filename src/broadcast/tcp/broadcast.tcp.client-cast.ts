import { Socket } from 'net';
import { BroadcastTcpMessage } from './broadcast.tcp.message';
import { getClientAddress, writeSocketBuffer } from './broadcast.tcp.utils';

export class BroadcastTcpClientCast {
  protected _address: string;
  protected channels: Set<string> = new Set();

  constructor(private readonly socket: Socket, public readonly name: string) {
    this._address = getClientAddress(socket, false);
  }

  public get address(): string {
    return this._address;
  }

  public addChannel(channel: string): void {
    this.channels.add(channel);
  }

  public removeChannel(channel: string): void {
    this.channels.delete(channel);
  }

  public send(message: BroadcastTcpMessage): void {
    this.socket.write(writeSocketBuffer(message));
  }
}
