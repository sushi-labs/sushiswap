import { ChainId } from '@sushiswap/chain'
import { otherChains } from '@sushiswap/wagmi-config'
import { allChains, configureChains, createClient, readContracts } from '@wagmi/core'
import { erc20ABI } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { BigNumber } from 'ethers'

const { provider } = configureChains([...allChains, ...otherChains], [publicProvider()])
createClient({ provider })

export async function getTokenBalance(args: Parameters<typeof getTokenBalances>[0][0]) {
  return getTokenBalances([args]).then((result) => result[0])
}

export async function getTokenBalances(args: { token: string; user: string; chainId: ChainId }[]) {
  return readContracts<(BigNumber | null)[]>({
    allowFailure: true,
    contracts: args.map(({ token, user, chainId }) => ({
      addressOrName: token,
      functionName: 'balanceOf',
      args: [user],
      chainId,
      contractInterface: erc20ABI,
    })),
  }).then((results) =>
    results.map((result, index) => ({
      ...args[index],
      balance: result ? result.toString() : '0',
    }))
  )
}
