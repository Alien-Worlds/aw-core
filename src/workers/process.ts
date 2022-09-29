/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable } from 'inversify';
import { WorkerMessage, WorkerMessageHandler } from './worker-message';
import { WorkerOrchestrator } from './worker-orchestrator';

@injectable()
export class Process {
  private handlersByMessageType = new Map<string, WorkerMessageHandler>();

  constructor() {
    process.on('message', (message: WorkerMessage) => this.handleMessage(message));
  }

  private handleMessage(message: WorkerMessage) {
    const handler = this.handlersByMessageType.get(message.type);

    if (handler) {
      handler(message);
    }
  }

  get id(): number {
    return process.pid;
  }

  public addMessageHandler(type: string, handler: WorkerMessageHandler) {
    this.handlersByMessageType.set(type, handler);
  }

  public sendToMainThread(message: WorkerMessage) {
    WorkerOrchestrator.sendToOrchestrator(message);
  }

  public start(...args: unknown[]) {
    throw new Error('Method not implemented.');
  }

  public stop(...args: unknown[]) {
    throw new Error('Method not implemented.');
  }
}
