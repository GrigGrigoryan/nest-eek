export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TransactionType {
  INIT = 'init',
  RETRY = 'retry',
  REFUND = 'refund',
  CANCEL = 'cancel',
}
