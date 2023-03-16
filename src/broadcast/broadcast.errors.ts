import { BroadcastErrorType } from './broadcast.enums';

export class MapperNotFoundError extends Error {
  constructor(queue: string) {
    super(`Mapper not found for ${queue}`);
  }
}

export class BroadcastError extends Error {
  constructor(public type: BroadcastErrorType, message?: string) {
    super(message);
  }
}

export class BroadcastSendError extends BroadcastError {
  constructor(private reason?: Error) {
    super(
      BroadcastErrorType.SendError,
      `An error occurred while sending a message. ${reason ? reason.message : ''}`
    );
  }
}
