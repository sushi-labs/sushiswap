import { JsonRpcResponse } from 'lib/jsonrpc'

/**
 * Basic explanation of the tx state types:
 *
 * - CHECKING -> Tx checks are in place until a resolution happens: OK, INDETERMINATE, ERROR.
 * - OK -> Relay received the Tx && all downstream miners accepted without complains && tx mined sucessfully
 * - INDETERMINATE -> Relay received correctly the Tx && at least one miner accepted the TX && TX potentially mineable
 * - ERROR -> Relay hasen't received the TX || none of the miners accepted the Tx || Tx was not mined sucessfully
 */
export enum PrivateTxState {
  CHECKING = 'CHECKING',
  OK = 'OK',
  INDETERMINATE = 'INDETERMINATE',
  ERROR = 'ERROR',
}

export type RelayResponses = Record<string, RelayResponse>

export interface RelayResponse {
  response: JsonRpcResponse<any>
  error?: string
}

export interface PrivateTxStatus {
  transactionHash: string
  receivedAt: string
  relayedAt?: string
  minedAt?: string
  relayFailure?: boolean
  relayResponses?: RelayResponses
}
