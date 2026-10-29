import { BaseError, ContractFunctionRevertedError, parseAbi } from 'viem'

/** Errors V4 vaults bubble up from their pool's hook during a deposit. */
export const steerDepositErrorsAbi = parseAbi(['error OracleStale()'])

const STEER_DEPOSIT_ERROR_MESSAGES: Record<string, string> = {
  OracleStale: 'Pool price oracle is stale, try again later',
}

export function getSteerDepositErrorMessage(
  error: Error | null,
): string | undefined {
  if (!(error instanceof BaseError)) return undefined

  const revert = error.walk((e) => e instanceof ContractFunctionRevertedError)
  if (!(revert instanceof ContractFunctionRevertedError)) return undefined

  const errorName = revert.data?.errorName
  return errorName ? STEER_DEPOSIT_ERROR_MESSAGES[errorName] : undefined
}
