import { type Config, readContracts } from '@wagmi/core'
import type { EvmChainId } from 'sushi/evm'
import { type Address, erc20Abi } from 'viem'

export async function fetchBalances(
  args: { token: string; user: string; chainId: EvmChainId }[],
  config: Config,
): Promise<Record<string, string>> {
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
