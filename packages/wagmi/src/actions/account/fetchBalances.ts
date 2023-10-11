import { ChainId } from 'sushi/chain'
import { Address, erc20ABI, readContracts } from '@wagmi/core'

export async function fetchBalances(
  args: { token: string; user: string; chainId: ChainId }[],
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
