import { ChainId } from '@sushiswap/chain'
import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { Address, configureChains, createClient, erc20ABI, readContracts } from '@wagmi/core'

const { provider, webSocketProvider } = configureChains(allChains, allProviders)

createClient({ provider, webSocketProvider })

export async function fetchBalances(
  args: { token: string; user: string; chainId: ChainId }[]
): Promise<Record<string, string>> {
  const balances = await readContracts({
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
  }).then((values) => values.map((value, i) => ({ ...args[i], value })))

  return Object.fromEntries(
    balances
      .filter(({ value }) => value !== null && value.gt(0))
      .map((balance) => [`${balance.chainId}:${balance.token}`, balance.value.toString()])
  )
}
