import { isPromiseFulfilled } from 'sushi'
import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { Address, configureChains, createConfig, erc20ABI, readContract } from '@wagmi/core'

const { publicClient } = configureChains(allChains, allProviders)

createConfig({ publicClient })

export async function fetchBalances(
  args: { token: string; user: string; chainId: number }[]
): Promise<Record<string, string>> {
  // const _balances = await readContracts({
  //   allowFailure: true,
  //   contracts: args.map(
  //     ({ token, user, chainId }) =>
  //       ({
  //         address: token as Address,
  //         functionName: 'balanceOf',
  //         args: [user as Address],
  //         chainId,
  //         abi: erc20ABI,
  //       } as const)
  //   ),
  // })

  const balances = await Promise.allSettled(
    args.map(({ token, user, chainId }) =>
      readContract({
        address: token as Address,
        functionName: 'balanceOf',
        args: [user as Address],
        chainId,
        abi: erc20ABI,
      } as const)
    )
  ).then((promiseSettledResults) => {
    if (!Array.isArray(promiseSettledResults)) {
      console.error('balance readContract failed')
      return []
    }
    return promiseSettledResults.map((promiseSettledResult, i) => {
      return {
        ...args[i],
        value: isPromiseFulfilled(promiseSettledResult) ? promiseSettledResult.value : 0n,
      }
    })
  })

  return Object.fromEntries(
    balances.map((balance) => [`${balance.chainId}:${balance.token}`, balance.value.toString()])
  )
}
