export enum FuroType {
  STREAM = 'Stream',
  VESTING = 'Vesting',
}

export enum FuroStatus {
  ACTIVE = 'ACTIVE',
  EXTENDED = 'EXTENDED',
  CANCELLED = 'CANCELLED',
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  EXTEND = 'EXTEND',
  WITHDRAWAL = 'WITHDRAWAL',
  DISBURSEMENT = 'DISBURSEMENT', // Payment to a sender and reciever when stream is cancelled
}

export enum VestingType {
  IMMEDIATE = 'IMMEDIATE',
  GRADED = 'GRADED',
  CLIFF = 'CLIFF',
  HYBRID = 'HYBRID',
}

export enum PeriodType {
  START = 'START',
  CLIFF = 'CLIFF',
  STEP = 'STEP',
  END = 'END',
}
