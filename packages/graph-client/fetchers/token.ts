import { ChainId } from '@sushiswap/chain'
import { otherChains } from '@sushiswap/wagmi-config'
import { allChains, configureChains, createClient, readContract } from '@wagmi/core'
import { erc20ABI } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID
const infuraId = process.env.INFURA_ID || process.env.NEXT_PUBLIC_INFURA_ID

const { provider } = configureChains(
  [...allChains, ...otherChains],
  [
    jsonRpcProvider({
      priority: 0,
      rpc: (chain) => {
        if (chain.id !== 1) return null
        return {
          http: `https://api.securerpc.com/v1`,
          webSocket: `wss://api.securerpc.com/v1`,
        }
      },
    }),
    alchemyProvider({ apiKey: alchemyId, priority: 1 }),
    publicProvider({ priority: 2 }),
  ]
)

createClient({ provider })

export async function getTokenBalance(args: Parameters<typeof getTokenBalances>[0][0]) {
  return getTokenBalances([args]).then((result) => result[0])
}

export async function getTokenBalances(args: { token: string; user: string; chainId: ChainId }[]) {
  return Promise.all(
    args.map(({ token, user, chainId }) =>
      readContract({
        addressOrName: token,
        functionName: 'balanceOf',
        args: [user],
        chainId,
        contractInterface: erc20ABI,
      })
    )
  ).then((results) => {
    return results.map((result, i) => ({
      ...args[i],
      balance: result ? result.toString() : '0',
    }))
  })
}
