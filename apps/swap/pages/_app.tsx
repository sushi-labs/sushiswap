import '@sushiswap/ui/index.css'

import { useLatestBlockNumber } from '@sushiswap/hooks'
import { App, ThemeProvider, ToastContainer } from '@sushiswap/ui'
import { client, getProviders } from '@sushiswap/wagmi'
import { Header } from 'components'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { Updaters as MulticallUpdaters } from 'lib/state/MulticallUpdaters'
import { Updaters as TokenListsUpdaters } from 'lib/state/TokenListsUpdaters'
import type { AppProps } from 'next/app'
import { FC, useMemo } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store'
import { WagmiConfig } from 'wagmi'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const [providerArbitrum, providerOptimism, providerAvalanche, providerFantom] = getProviders(SUPPORTED_CHAIN_IDS)

  // const blockNumberEthereum = useLatestBlockNumber(providerEthereum)
  // const blockNumberBsc = useLatestBlockNumber(providerBsc)
  // const blockNumberPolygon = useLatestBlockNumber(providerPolygon)
  const blockNumberArbitrum = useLatestBlockNumber(providerArbitrum)
  const blockNumberOptimism = useLatestBlockNumber(providerOptimism)
  const blockNumberAvalanche = useLatestBlockNumber(providerAvalanche)

  const blockNumberFantom = useLatestBlockNumber(providerFantom)
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
      blockNumberAvalanche,
      blockNumberFantom,
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
      blockNumberAvalanche,
      blockNumberFantom,
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
        <ThemeProvider>
          <App.Shell>
            <Header />
            <MulticallUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
            <TokenListsUpdaters chainIds={SUPPORTED_CHAIN_IDS} />
            <Component {...pageProps} blockNumbers={blockNumbers} chainIds={SUPPORTED_CHAIN_IDS} />
            <App.Footer />
            <ToastContainer className="mt-[50px]" />
          </App.Shell>
        </ThemeProvider>
      </Provider>
    </WagmiConfig>
  )
}

export default MyApp
