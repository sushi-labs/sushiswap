import { ChainId } from '@sushiswap/chain'
import { isPromiseFulfilled } from '@sushiswap/validate'
import { otherChains } from '@sushiswap/wagmi-config'
import { Address, allChains, configureChains, createClient, erc20ABI, readContracts, readContract } from '@wagmi/core'
import { alchemyProvider } from '@wagmi/core/providers/alchemy'
// import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { publicProvider } from '@wagmi/core/providers/public'
import { BigNumber } from 'ethers'

const alchemyId = process.env.ALCHEMY_ID || process.env.NEXT_PUBLIC_ALCHEMY_ID
const infuraId = process.env.INFURA_ID || process.env.NEXT_PUBLIC_INFURA_ID

if (!alchemyId) {
  throw Error('NO ALCHEMY ID SET')
}

const { provider } = configureChains(
  [...allChains, ...otherChains],
  [
    // jsonRpcProvider({
    //   priority: 0,
    //   rpc: (chain) => {
    //     if (chain.id !== 1) return null
    //     return {
    //       http: `https://api.securerpc.com/v1`,
    //       webSocket: `wss://api.securerpc.com/v1`,
    //     }
    //   },
    // }),
    alchemyProvider({ apiKey: alchemyId, priority: 1 }),
    publicProvider({ priority: 2 }),
  ]
)

createClient({ provider })

export async function fetchBalances(
  args: { token: string; user: string; chainId: ChainId }[]
): Promise<Record<string, string>> {
  const balances = await readContracts({
    allowFailure: true,
    contracts: args.map(({ token, user, chainId }) => ({
      address: token as Address,
      functionName: 'balanceOf',
      args: [user as Address] as const,
      chainId,
      abi: erc20ABI,
    })),
  }).then((values) => values.map((value, i) => ({ ...args[i], value })))

  return Object.fromEntries(
    balances
      .filter(({ value }) => value !== null && value.gt(0))
      .map((balance) => [`${balance.chainId}:${balance.token}`, balance.value.toString()])
  )
}
