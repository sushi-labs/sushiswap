import { isPromiseFulfilled } from '@sushiswap/validate'
import { allChains, allProviders } from '@sushiswap/wagmi-config'
import { Address, configureChains, createClient, erc20ABI, readContract } from '@wagmi/core'
import { BigNumber } from 'ethers'

const { provider } = configureChains(allChains, allProviders)

createClient({ provider })

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
        value: isPromiseFulfilled(promiseSettledResult) ? promiseSettledResult.value : BigNumber.from(0),
      }
    })
  })

  return Object.fromEntries(
    balances
      // .filter(({ value }) => BigNumber.isBigNumber(value) && value.gt(0))
      .map((balance) => [`${balance.chainId}:${balance.token}`, balance.value.toString()])
  )
}
