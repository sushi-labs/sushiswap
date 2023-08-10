import { bentoBoxV1TotalsAbi } from '@sushiswap/abi'
import { bentoBoxV1Address, BentoBoxV1ChainId } from '@sushiswap/bentobox'
import { Type as Currency } from '@sushiswap/currency'
import { Rebase } from '@sushiswap/tines'
import { Address, readContracts } from 'wagmi'

const totalsMap = new Map<string, Rebase>()

export const getBentoboxTotalsMap = async (chainId: BentoBoxV1ChainId, currencies: (Currency | undefined)[]) => {
  const addresses = currencies
    .filter((currency): currency is Currency => Boolean(currency?.wrapped))
    .map((token) => token.wrapped.address)

  const contracts = addresses.map(
    (address) =>
      ({
        chainId,
        address: bentoBoxV1Address[chainId] as Address,
        abi: bentoBoxV1TotalsAbi,
        functionName: 'totals',
        args: [address as Address],
      } as const)
  )

  try {
    const totals = await readContracts({
      allowFailure: false,
      contracts,
    })

    totals.forEach((total, i) => totalsMap.set(addresses[i], { base: total[0], elastic: total[1] }))

    return totalsMap
  } catch {
    return null
  }
}

export const getBentoboxTotals = async (chainId: BentoBoxV1ChainId, currencies: (Currency | undefined)[]) => {
  const addresses = currencies
    .filter((currency): currency is Currency => Boolean(currency?.wrapped))
    .map((token) => token.wrapped.address)

  const contracts = addresses.map(
    (address) =>
      ({
        chainId,
        address: bentoBoxV1Address[chainId] as Address,
        abi: bentoBoxV1TotalsAbi,
        functionName: 'totals',
        args: [address as Address],
      } as const)
  )

  try {
    return readContracts({
      allowFailure: false,
      contracts,
    }).then((results) => results.map((result) => ({ elastic: result[0], base: result[1] })))
  } catch {
    return null
  }
}
