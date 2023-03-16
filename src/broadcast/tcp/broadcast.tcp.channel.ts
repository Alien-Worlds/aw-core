import { BroadcastTcpClientCast } from './broadcast.tcp.client-cast';
import { BroadcastTcpMessage } from './broadcast.tcp.message';
import { writeSocketBuffer } from './broadcast.tcp.utils';

export class BroadcastTcpChannel {
  constructor(
    public readonly name: string,
    protected readonly clients: BroadcastTcpClientCast[] = []
  ) {
    clients.forEach(client => {
      client.addChannel(name);
    });
  }

  public addClient(client: BroadcastTcpClientCast): void {
    const ref = this.clients.find(c => c.address === client.address);
    if (!ref) {
      client.addChannel(this.name);
      this.clients.push(client);
    }
  }

  public removeClient(address: string): void {
    const i = this.clients.findIndex(c => c.address === address);
    if (i > -1) {
      this.clients[i].removeChannel(this.name);
      this.clients.splice(i, 1);
    }
  }

  public sendMessage(message: BroadcastTcpMessage, exclude: string[] = []) {
    let sent = false;
    this.clients.forEach(client => {
      if (exclude.includes(client.address)) {
        return;
      }
      sent = true;
      client.send(message);
    });

    return sent;
  }
}
