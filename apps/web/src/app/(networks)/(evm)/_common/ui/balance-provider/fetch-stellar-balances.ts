import { getNativeAddress } from 'sushi'
import type {
  StellarAddress,
  StellarChainId,
  StellarContractAddress,
} from 'sushi/stellar'
import { contractAddresses } from '../../../../(non-evm)/stellar/_common/lib/soroban/contracts'
import { getTokenBalance } from '../../../../(non-evm)/stellar/_common/lib/soroban/token-helpers'

interface FetchStellarBalancesParams {
  chainId: StellarChainId
  tokenAddresses: StellarContractAddress[]
  account: StellarAddress
}

export async function fetchStellarBalances({
  chainId,
  tokenAddresses,
  account,
}: FetchStellarBalancesParams): Promise<ReadonlyMap<StellarAddress, bigint>> {
  const nativeAddress = getNativeAddress(chainId) as StellarContractAddress
  const xlmContract = contractAddresses.TOKENS.XLM
  const uniqueTokenAddresses = Array.from(new Set(tokenAddresses))

  // The native placeholder doesn't exist on-chain; XLM lives at its own
  // contract address. Map native -> XLM contract for the lookup, then
  // attribute the result back to whichever address the caller asked for.
  const balances = await Promise.all(
    uniqueTokenAddresses.map(async (address) => {
      const contractAddress = address === nativeAddress ? xlmContract : address
      const balance = await getTokenBalance(account, contractAddress)
      return [address, balance] as const
    }),
  )

  return new Map(balances)
}
