import { Socket } from 'net';
import { BroadcastTcpMessage } from './broadcast.tcp.message';
import { writeSocketBuffer, getClientAddress } from './broadcast.tcp.utils';

export class BroadcastTcpMessageQueue {
  private queue: BroadcastTcpMessage[] = [];
  private started = false;
  private address: string;

  constructor(private client: Socket) {}

  public add(message: BroadcastTcpMessage) {
    if (message.content.type === 'SYSTEM') {
      this.queue.unshift(message);
    } else {
      this.queue.push(message);
    }

    if (this.started === true) {
      this.loop();
    }
  }

  public start() {
    this.address = getClientAddress(this.client, true);
    this.started = true;
    this.loop();
  }

  public stop() {
    this.started = false;
  }

  private loop() {
    while (this.started && this.queue.length > 0) {
      const message = this.queue.shift();
      message.content.sender = this.address;
      const buffer = writeSocketBuffer(message);
      this.client.write(buffer);
    }
  }
}
