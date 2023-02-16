import { ChainId } from '@sushiswap/chain'
import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { Address, configureChains, createClient, erc20ABI, readContracts } from '@wagmi/core'
import { BigNumber } from 'ethers'

const { provider } = configureChains(allChains, allProviders)

createClient({ provider })

export async function fetchBalances(
  args: { token: string; user: string; chainId: ChainId }[]
): Promise<Record<string, string>> {
  const _balances = await readContracts({
    allowFailure: true,
    contracts: args.map(
      ({ token, user, chainId }) =>
        ({
          address: token as Address,
          functionName: 'balanceOf',
          args: [user as Address],
          chainId,
          abi: erc20ABI,
        } as const)
    ),
  })

  const balances = args.map((arg, i) => ({ ...arg, value: !_balances[i] ? BigNumber.from(0) : _balances[i] }))

  return Object.fromEntries(
    balances
      .filter(({ value }) => BigNumber.isBigNumber(value) && value.gt(0))
      .map((balance) => [`${balance.chainId}:${balance.token}`, balance.value.toString()])
  )
}
