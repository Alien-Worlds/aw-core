export enum ConnectionState {
  Online = 'online',
  Offline = 'offline',
  Connecting = 'connecting',
  Closing = 'closing',
}

export enum BroadcastErrorType {
  SendError = 'send_error',
}

export enum BroadcastDriver {
  Amq = 'AMQ',
  Tcp = 'TCP',
}
