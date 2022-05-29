import '@sushiswap/ui/index.css'

import { ChainId } from '@sushiswap/chain'
import { useLatestBlockNumber } from '@sushiswap/hooks'
import { App } from '@sushiswap/ui'
import { client, getProviders } from '@sushiswap/wagmi'
import { Header } from 'components'
import { Updaters as MulticallUpdaters } from 'lib/state/MulticallUpdaters'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import type { AppProps } from 'next/app'
import { FC, useMemo } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store'
import { WagmiConfig } from 'wagmi'

const SUPPORTED_CHAIN_IDS = [
  // ChainId.ETHEREUM,
  // ChainId.BSC,
  // ChainId.AVALANCHE,
  // ChainId.POLYGON,
  ChainId.ARBITRUM,
  ChainId.OPTIMISM,
  // ChainId.FANTOM,
  // TESTNETS
  // ChainId.POLYGON_TESTNET,
  // ChainId.RINKEBY,
  // ChainId.ROPSTEN,
  // ChainId.GÖRLI,
  // ChainId.KOVAN,
]

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const [
    // providerEthereum,
    // providerBsc,
    // providerAvalanche,
    // providerPolygon,
    providerArbitrum,
    providerOptimism,
    // providerFantom,
    // providerPolygonTestnet,
    // providerRinkeby,
    // providerRopsten,
    // providerGorli,
    // providerKovan,
  ] = getProviders(SUPPORTED_CHAIN_IDS)

  // const blockNumberEthereum = useLatestBlockNumber(providerEthereum)
  // const blockNumberBsc = useLatestBlockNumber(providerBsc)
  // const blockNumberAvalanche = useLatestBlockNumber(providerAvalanche)
  // const blockNumberPolygon = useLatestBlockNumber(providerPolygon)
  const blockNumberArbitrum = useLatestBlockNumber(providerArbitrum)
  const blockNumberOptimism = useLatestBlockNumber(providerOptimism)

  // const blockNumberFantom = useLatestBlockNumber(providerFantom)
  // const blockNumberPolygonTestnet = useLatestBlockNumber(providerPolygonTestnet)
  // const blockNumberRinkeby = useLatestBlockNumber(providerRinkeby)
  // const blockNumberRopsten = useLatestBlockNumber(providerRopsten)
  // const blockNumberGorli = useLatestBlockNumber(providerGorli)
  // const blockNumberKovan = useLatestBlockNumber(providerKovan)
  const blockNumbers = useMemo(
    () => [
      // blockNumberEthereum,
      // blockNumberPolygon,
      blockNumberArbitrum,
      blockNumberOptimism,
      // blockNumberPolygonTestnet,
      // blockNumberRinkeby,
      // blockNumberRopsten,
      // blockNumberGorli,
      // blockNumberKovan,
    ],
    [
      // blockNumberEthereum,
      // blockNumberPolygon,
      blockNumberArbitrum,
      blockNumberOptimism,
      // blockNumberPolygonTestnet,
      // blockNumberRinkeby,
      // blockNumberRopsten,
      // blockNumberGorli,
      // blockNumberKovan,
    ]
  )

  // console.log({
  //   blockNumberEthereum,
  //   blockNumberPolygon,
  //   blockNumberArbitrum,
  //   blockNumberRinkeby,
  //   blockNumberRopsten,
  //   blockNumberGorli,
  //   blockNumberKovan,
  // })

  return (
    <WagmiConfig client={client}>
      <Provider store={store}>
        <App.Shell>
          <Header />
          <MulticallUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
          <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
          <Component {...pageProps} blockNumbers={blockNumbers} chainIds={SUPPORTED_CHAIN_IDS} />
          <App.Footer />
        </App.Shell>
      </Provider>
    </WagmiConfig>
  )
}

export default MyApp
