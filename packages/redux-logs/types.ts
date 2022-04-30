export interface EventFilter {
  address?: string
  topics?: Array<string | Array<string> | null>
}

export interface Log {
  topics: Array<string>
  data: string
  transactionIndex: number
  logIndex: number
  blockNumber: number
}

export interface LogsState {
  [chainId: number]: {
    [filterKey: string]: {
      listeners: number
      fetchingBlockNumber?: number
      results?:
        | {
            blockNumber: number
            logs: Log[]
            error?: undefined
          }
        | {
            blockNumber: number
            logs?: undefined
            error: true
          }
    }
  }
}

export interface WithLogsState {
  [path: string]: LogsState
}
