import { BroadcastTcpMessage } from './broadcast.tcp.message';

export class BroadcastTcpStash {
  private messagesByChannel: Map<string, BroadcastTcpMessage[]> = new Map();

  public add(message: BroadcastTcpMessage) {
    const {
      content: { channel },
    } = message;

    if (this.messagesByChannel.has(channel)) {
      this.messagesByChannel.get(channel).push(message);
    } else {
      this.messagesByChannel.set(channel, [message]);
    }
  }

  public pop(channel: string): BroadcastTcpMessage[] {
    if (this.messagesByChannel.has(channel)) {
      const messages = this.messagesByChannel.get(channel);
      this.messagesByChannel.delete(channel);
      return messages;
    }

    return [];
  }
}
