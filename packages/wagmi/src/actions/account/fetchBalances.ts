import { publicWagmiConfig } from '@sushiswap/wagmi-config'
import { createConfig, readContracts } from '@wagmi/core'
import { ChainId } from 'sushi/chain'
import { Address, erc20Abi } from 'viem'

export async function fetchBalances(
  args: { token: string; user: string; chainId: ChainId }[],
): Promise<Record<string, string>> {
  const config = createConfig(publicWagmiConfig)

  const balances = await readContracts(config, {
    allowFailure: true,
    contracts: args.map(
      ({ token, user, chainId }) =>
        ({
          address: token as Address,
          functionName: 'balanceOf',
          args: [user as Address],
          chainId,
          abi: erc20Abi,
        }) as const,
    ),
  }).then((values) =>
    values.map((value, i) => ({ ...args[i], value: value.result })),
  )

  return Object.fromEntries(
    balances
      .filter(({ value }) => value !== undefined && value > 0n)
      .map((balance) => [
        `${balance.chainId}:${balance.token}`,
        String(balance.value),
      ]),
  )
}
