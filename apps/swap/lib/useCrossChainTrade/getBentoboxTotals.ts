import { Type, Type as Currency } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { getBentoBoxContractConfig } from '@sushiswap/wagmi-config'
import { Address, readContracts } from 'wagmi'
import { ChainId } from '@sushiswap/chain'

export const getBentoboxTotals = async (chainId: ChainId | undefined, currencies: (Currency | undefined)[]) => {
  const addresses = currencies
    .filter((currency): currency is Currency => Boolean(currency && currency.wrapped))
    .map((token) => token.wrapped.address)

  const contracts = addresses.map(
    (address) =>
      ({
        chainId,
        address: getBentoBoxContractConfig(chainId).address,
        abi: [
          {
            inputs: [
              {
                internalType: 'contract IERC20',
                name: '',
                type: 'address',
              },
            ],
            name: 'totals',
            outputs: [
              {
                internalType: 'uint128',
                name: 'elastic',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'base',
                type: 'uint128',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        functionName: 'totals',
        args: [address as Address],
      } as const)
  )

  const totals = await readContracts({
    contracts,
  })

  const result: { base: JSBI; elastic: JSBI }[] = []
  currencies.forEach((currency, index) => {
    if (totals?.[index]) {
      const { base, elastic } = totals[index]
      result[index] = {
        base: JSBI.BigInt(base),
        elastic: JSBI.BigInt(elastic),
      }
    }
  })

  return result
}

export const getBentoboxTotal = async ({ chainId, currency }: { chainId: ChainId; currency: Type }) => {
  const totals = await getBentoboxTotals(chainId, [currency])

  if (!totals || !currency) {
    return undefined
  }

  return totals[0]
}
