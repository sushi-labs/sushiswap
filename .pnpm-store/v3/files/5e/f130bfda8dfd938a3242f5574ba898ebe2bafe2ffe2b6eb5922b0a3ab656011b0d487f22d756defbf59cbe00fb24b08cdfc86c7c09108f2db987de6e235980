import { AddressEx, TokenInfo } from './common'

export type ParamValue = string | ParamValue[]

export enum Operation {
  CALL = 0,
  DELEGATE = 1,
}

export type InternalTransaction = {
  operation: Operation
  to: string
  value?: string
  data?: string
  dataDecoded?: DataDecoded
}

export type ValueDecodedType = InternalTransaction[]

export type Parameter = {
  name: string
  type: string
  value: ParamValue
  valueDecoded?: ValueDecodedType
}

export type DataDecoded = {
  method: string
  parameters?: Parameter[]
}

export enum TransactionStatus {
  AWAITING_CONFIRMATIONS = 'AWAITING_CONFIRMATIONS',
  AWAITING_EXECUTION = 'AWAITING_EXECUTION',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  WILL_BE_REPLACED = 'WILL_BE_REPLACED',
}

export enum TransferDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
  UNKNOWN = 'UNKNOWN',
}

export enum TransactionTokenType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  NATIVE_COIN = 'NATIVE_COIN',
}

export enum SettingsInfoType {
  SET_FALLBACK_HANDLER = 'SET_FALLBACK_HANDLER',
  ADD_OWNER = 'ADD_OWNER',
  REMOVE_OWNER = 'REMOVE_OWNER',
  SWAP_OWNER = 'SWAP_OWNER',
  CHANGE_THRESHOLD = 'CHANGE_THRESHOLD',
  CHANGE_IMPLEMENTATION = 'CHANGE_IMPLEMENTATION',
  ENABLE_MODULE = 'ENABLE_MODULE',
  DISABLE_MODULE = 'DISABLE_MODULE',
  SET_GUARD = 'SET_GUARD',
  DELETE_GUARD = 'DELETE_GUARD',
}

export type Erc20Transfer = {
  type: TransactionTokenType.ERC20
  tokenAddress: string
  tokenName?: string
  tokenSymbol?: string
  logoUri?: string
  decimals?: number
  value: string
}

export type Erc721Transfer = {
  type: TransactionTokenType.ERC721
  tokenAddress: string
  tokenId: string
  tokenName?: string
  tokenSymbol?: string
  logoUri?: string
}

export type NativeCoinTransfer = {
  type: TransactionTokenType.NATIVE_COIN
  value: string
}

export type TransferInfo = Erc20Transfer | Erc721Transfer | NativeCoinTransfer

export interface Transfer {
  type: 'Transfer'
  sender: AddressEx
  recipient: AddressEx
  direction: TransferDirection
  transferInfo: TransferInfo
}

export type SetFallbackHandler = {
  type: SettingsInfoType.SET_FALLBACK_HANDLER
  handler: AddressEx
}

export type AddOwner = {
  type: SettingsInfoType.ADD_OWNER
  owner: AddressEx
  threshold: number
}

export type RemoveOwner = {
  type: SettingsInfoType.REMOVE_OWNER
  owner: AddressEx
  threshold: number
}

export type SwapOwner = {
  type: SettingsInfoType.SWAP_OWNER
  oldOwner: AddressEx
  newOwner: AddressEx
}

export type ChangeThreshold = {
  type: SettingsInfoType.CHANGE_THRESHOLD
  threshold: number
}

export type ChangeImplementation = {
  type: SettingsInfoType.CHANGE_IMPLEMENTATION
  implementation: AddressEx
}

export type EnableModule = {
  type: SettingsInfoType.ENABLE_MODULE
  module: AddressEx
}

export type DisableModule = {
  type: SettingsInfoType.DISABLE_MODULE
  module: AddressEx
}

export type SetGuard = {
  type: SettingsInfoType.SET_GUARD
  guard: AddressEx
}

export type DeleteGuard = {
  type: SettingsInfoType.DELETE_GUARD
}

export type SettingsInfo =
  | SetFallbackHandler
  | AddOwner
  | RemoveOwner
  | SwapOwner
  | ChangeThreshold
  | ChangeImplementation
  | EnableModule
  | DisableModule
  | SetGuard
  | DeleteGuard

export type SettingsChange = {
  type: 'SettingsChange'
  dataDecoded: DataDecoded
  settingsInfo?: SettingsInfo
}

export interface Custom {
  type: 'Custom'
  to: AddressEx
  dataSize: string
  value: string
  methodName?: string
  actionCount?: number
  isCancellation: boolean
}

export type MultiSend = {
  type: 'Custom'
  to: AddressEx
  dataSize: string
  value: string
  methodName: 'multiSend'
  actionCount: number
  isCancellation: boolean
}

export type Cancellation = Custom & {
  isCancellation: true
}

export type Creation = {
  type: 'Creation'
  creator: AddressEx
  transactionHash: string
  implementation?: AddressEx
  factory?: AddressEx
}

export type TransactionInfo = Transfer | SettingsChange | Custom | MultiSend | Cancellation | Creation

export type ModuleExecutionInfo = {
  type: 'MODULE'
  address: AddressEx
}

export type MultisigExecutionInfo = {
  type: 'MULTISIG'
  nonce: number
  confirmationsRequired: number
  confirmationsSubmitted: number
  missingSigners?: AddressEx[]
}

export type ExecutionInfo = ModuleExecutionInfo | MultisigExecutionInfo

export type TransactionSummary = {
  id: string
  timestamp: number
  txStatus: TransactionStatus
  txInfo: TransactionInfo
  executionInfo?: ExecutionInfo
  safeAppInfo?: SafeAppInfo
}

export type Transaction = {
  transaction: TransactionSummary
  conflictType: 'None' | 'HasNext' | 'End'
  type: 'TRANSACTION'
}

// WIP types:

export type IncomingTransfer = Omit<Transaction, 'transaction'> & {
  transaction: Omit<TransactionSummary, 'txInfo' | 'executionInfo'> & {
    txInfo: Omit<Transfer, 'direction'> & { direction: TransferDirection.INCOMING }
  }
}

export type ModuleTransaction = Omit<Transaction, 'transaction'> & {
  transaction: Omit<TransactionSummary, 'txInfo' | 'executionInfo'> & {
    txInfo: Transfer
    executionInfo?: ModuleExecutionInfo
  }
}

export type MultisigTransaction = Omit<Transaction, 'transaction'> & {
  transaction: Omit<TransactionSummary, 'txInfo' | 'executionInfo'> & {
    txInfo: Omit<Transfer, 'direction'> & { direction: TransferDirection.OUTGOING }
    executionInfo?: MultisigExecutionInfo
  }
}

export type DateLabel = {
  timestamp: number
  type: 'DATE_LABEL'
}

/**
 * @see https://gnosis.github.io/safe-client-gateway/docs/routes/transactions/models/summary/enum.Label.html
 */
export enum LabelValue {
  Queued = 'Queued',
  Next = 'Next',
}

export type Label = {
  label: LabelValue
  type: 'LABEL'
}

export type ConflictHeader = {
  nonce: number
  type: 'CONFLICT_HEADER'
}

export type TransactionListItem = Transaction | DateLabel | Label | ConflictHeader

export type Page<T> = {
  next?: string
  previous?: string
  results: Array<T>
}

export type TransactionListPage = Page<TransactionListItem>

export type MultisigTransactionRequest = {
  to: string
  value: string
  data?: string
  nonce: string
  operation: Operation
  safeTxGas: string
  baseGas: string
  gasPrice: string
  gasToken: string
  refundReceiver?: string
  safeTxHash: string
  sender: string
  signature?: string
  origin?: string
}

/* Transaction details types */
export type SafeAppInfo = {
  name: string
  url: string
  logoUri: string
}

export type TransactionData = {
  hexData?: string
  dataDecoded?: DataDecoded
  to: AddressEx
  value?: string
  operation: Operation
  addressInfoIndex?: { [key: string]: AddressEx }
  trustedDelegateCallTarget: boolean
}

export type ModuleExecutionDetails = {
  type: 'MODULE'
  address: AddressEx
}

export type MultisigConfirmation = {
  signer: AddressEx
  signature?: string
  submittedAt: number
}

export type MultisigExecutionDetails = {
  type: 'MULTISIG'
  submittedAt: number
  nonce: number
  safeTxGas: string
  baseGas: string
  gasPrice: string
  gasToken: string
  refundReceiver: AddressEx
  safeTxHash: string
  executor?: AddressEx
  signers: AddressEx[]
  confirmationsRequired: number
  confirmations: MultisigConfirmation[]
  rejectors?: AddressEx[]
  gasTokenInfo?: TokenInfo
}

export type DetailedExecutionInfo = ModuleExecutionDetails | MultisigExecutionDetails

export type TransactionDetails = {
  txId: string
  executedAt?: number
  txStatus: TransactionStatus
  txInfo: TransactionInfo
  txData?: TransactionData
  detailedExecutionInfo?: DetailedExecutionInfo
  txHash?: string
  safeAppInfo?: SafeAppInfo
}

/* Transaction details types end */

/* Transaction estimation types */

export type SafeTransactionEstimationRequest = {
  to: string
  value: string
  data: string
  operation: Operation
}

// CGW v2 response
export type SafeTransactionEstimation = {
  currentNonce: number
  recommendedNonce: number
  safeTxGas: string
}

/* Transaction estimation types end */
