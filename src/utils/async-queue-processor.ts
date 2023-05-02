export interface AsyncQueue<T> {
  nextBatch(): Promise<T[]>;
  add(items: T[]): Promise<void>;
}

export abstract class AsyncQueueProcessor<T = unknown> {
  protected readonly batchDelay = 1000;
  protected loop = true;
  protected busy = false;

  protected abstract processBatch(items: T[]): Promise<T[]>;

  public async processQueue(queue: AsyncQueue<T>): Promise<void> {
    if (this.busy) {
      return;
    }
    this.busy = true;

    for await (const batch of this.iterateQueue(queue)) {
      const failed = await this.processBatch(batch);
      if (failed.length > 0) {
        await queue.add(failed);
      }
    }
    this.busy = false;
  }

  public stop(): void {
    this.loop = false;
  }

  public isBusy(): boolean {
    return this.busy;
  }

  protected async *iterateQueue(queue: AsyncQueue<T>): AsyncGenerator<T[]> {
    while (this.loop) {
      const batch = await queue.nextBatch();
      if (batch.length === 0) {
        break;
      }
      yield batch;
      await new Promise(resolve => setTimeout(resolve, this.batchDelay));
    }
  }
}
