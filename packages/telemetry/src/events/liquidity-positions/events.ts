/**
 * LP specific events.
 */
export enum LiquidityEventName {
  ADD_LIQUIDITY_SUBMITTED = 'Add Liquidity Submitted',
  COLLECT_LIQUIDITY_SUBMITTED = 'Collect Liquidity Submitted',
  MIGRATE_LIQUIDITY_SUBMITTED = 'Migrate Liquidity Submitted',
  REMOVE_LIQUIDITY_SUBMITTED = 'Remove Liquidity Submitted',
  SELECT_LIQUIDITY_POOL_FEE_TIER = 'Select Liquidity Pool Fee Tier',
}

/**
 * Zap specific events.
 */
export enum ZapEventName {
  ZAP_ERROR = 'Zap Error',
  ZAP_QUOTE_RECEIVED = 'Zap Quote Received',
  ZAP_ESTIMATE_GAS_CALL_FAILED = 'Zap Estimate Gas Call Failed',
  ZAP_SIGNED = 'Zap Signed',
  ZAP_TRANSACTION_COMPLETED = 'Zap Transaction Completed',
  ZAP_TRANSACTION_FAILED = 'Zap Transaction Failed',
}
