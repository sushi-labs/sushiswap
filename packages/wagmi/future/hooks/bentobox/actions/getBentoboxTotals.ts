import { Type as Currency } from '@sushiswap/currency'
import { Address, readContracts } from 'wagmi'
import { BentoBoxV1ChainId, isBentoBoxV1ChainId } from '@sushiswap/bentobox'
import { getBentoBoxContractConfig } from '../../../../hooks'
import { bentoBoxV1TotalsAbi } from '@sushiswap/abi'
import { BigNumber } from 'ethers'

export const getBentoboxTotals = async (chainId: BentoBoxV1ChainId, currencies: (Currency | undefined)[]) => {
  const addresses = currencies
    .filter((currency): currency is Currency => Boolean(currency && currency.wrapped))
    .map((token) => token.wrapped.address)

  const contracts = addresses.map(
    (address) =>
      ({
        chainId,
        address: getBentoBoxContractConfig(chainId).address,
        abi: bentoBoxV1TotalsAbi,
        functionName: 'totals',
        args: [address as Address],
      } as const)
  )

  try {
    return readContracts({
      allowFailure: false,
      contracts,
    })
  } catch {
    return null
  }
}
