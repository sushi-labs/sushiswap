import {
  Eip1559FeesNotSupportedError,
  type FeeValuesEIP1559,
  type FeeValuesLegacy,
  type PublicClient,
} from 'viem'
import {
  ANY_TOKEN_ANY_CHAIN_DEPOSIT_FEE_POLICY,
  type AnyTokenAnyChainDepositChainId,
} from '~evm/perps/_ui/account-management/deposit-dialog/any-token-deposit-config'

export type PerpsDepositTransactionFees =
  | (FeeValuesEIP1559 & { type: 'eip1559' })
  | (FeeValuesLegacy & { type: 'legacy' })

function increaseFee(value: bigint, percent: number): bigint {
  return (value * BigInt(100 + percent) + 99n) / 100n
}

/** Read current source-chain fees at submission, outside the LI.FI quote cache. */
export async function getPerpsDepositTransactionFees(
  chainId: AnyTokenAnyChainDepositChainId,
  client: Pick<PublicClient, 'chain' | 'estimateFeesPerGas'> | undefined,
): Promise<PerpsDepositTransactionFees> {
  if (!client?.chain || client.chain.id !== chainId) {
    throw new Error(
      'Deposit fee estimation requires a matching source-chain RPC client',
    )
  }
  const policy = ANY_TOKEN_ANY_CHAIN_DEPOSIT_FEE_POLICY
  const chain = client.chain
  try {
    const fees = await client.estimateFeesPerGas({
      chain: {
        ...chain,
        fees: { ...chain.fees, baseFeeMultiplier: policy.baseFeeMultiplier },
      },
      type: 'eip1559',
    })
    const maxPriorityFeePerGas = increaseFee(
      fees.maxPriorityFeePerGas,
      policy.priorityFeeIncreasePercent,
    )
    return {
      type: 'eip1559',
      gasPrice: undefined,
      maxPriorityFeePerGas,
      maxFeePerGas:
        fees.maxFeePerGas + maxPriorityFeePerGas - fees.maxPriorityFeePerGas,
    }
  } catch (error) {
    // Only chains without EIP-1559 use legacy fees. RPC failures must surface
    // instead of silently restoring the potentially stale LI.FI gas price.
    if (!(error instanceof Eip1559FeesNotSupportedError)) throw error
  }

  const fees = await client.estimateFeesPerGas({
    chain: { ...chain, fees: { ...chain.fees, baseFeeMultiplier: 1 } },
    type: 'legacy',
  })
  return {
    type: 'legacy',
    gasPrice: increaseFee(fees.gasPrice, policy.legacyGasPriceIncreasePercent),
    maxFeePerGas: undefined,
    maxPriorityFeePerGas: undefined,
  }
}
