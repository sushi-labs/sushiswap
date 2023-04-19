import { createClient, configureChains, mainnet } from '@wagmi/core'
import { publicProvider } from '@wagmi/core/providers/public'
import { getV3Pools } from '../future/hooks/pools/actions/getV3Pools'
import { USDC, WETH9 } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'

const { chains, provider, webSocketProvider } = configureChains([mainnet], [publicProvider()])

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
})

it('test', async () => {
  await getV3Pools(chains, [[WETH9[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]]])
})
