import { EvmChainId, type LaunchpadV2ChainId, addGasMargin } from 'sushi/evm'

// Arc enables the EIP-7825 transaction gas cap through its Osaka fork.
const ARC_TRANSACTION_GAS_LIMIT = 16_777_216n

export function getLaunchpadCreationGas(
  estimate: bigint,
  chainId: LaunchpadV2ChainId,
): bigint {
  const gas = addGasMargin(estimate)
  if (chainId !== EvmChainId.ARC) return gas
  if (estimate > ARC_TRANSACTION_GAS_LIMIT) {
    throw new Error('This launch exceeds Arc’s per-transaction gas limit.')
  }
  return gas > ARC_TRANSACTION_GAS_LIMIT ? ARC_TRANSACTION_GAS_LIMIT : gas
}
