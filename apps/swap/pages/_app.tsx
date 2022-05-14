import { FC } from 'react'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { ChainId } from '@sushiswap/chain'
import { getProviders, useLatestBlock } from '../hooks'
import { store } from '../store'
import { Updater } from '../Updater'
import '@sushiswap/ui/index.css'

const SUPPORTED_CHAIN_IDS = [
  // ChainId.ETHEREUM,
  // ChainId.BSC,
  // ChainId.AVALANCHE,
  // ChainId.POLYGON,
  // ChainId.ARBITRUM,
  // ChainId.OPTIMISM,
  // ChainId.FANTOM,
  // TESTNETS
  ChainId.POLYGON_TESTNET,
  ChainId.RINKEBY,
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
    // providerArbitrum,
    // providerFantom,
    providerPolygonTestnet,
    providerRinkeby,
    // providerRopsten,
    // providerGorli,
    // providerKovan,
  ] = getProviders(SUPPORTED_CHAIN_IDS)

  // const blockNumberEthereum = useLatestBlock(providerEthereum)
  // const blockNumberBsc = useLatestBlock(providerBsc)
  // const blockNumberAvalanche = useLatestBlock(providerAvalanche)
  // const blockNumberPolygon = useLatestBlock(providerPolygon)
  // const blockNumberArbitrum = useLatestBlock(providerArbitrum)

  // const blockNumberFantom = useLatestBlock(providerFantom)
  const blockNumberPolygonTestnet = useLatestBlock(providerPolygonTestnet)
  const blockNumberRinkeby = useLatestBlock(providerRinkeby)
  // const blockNumberRopsten = useLatestBlock(providerRopsten)
  // const blockNumberGorli = useLatestBlock(providerGorli)
  // const blockNumberKovan = useLatestBlock(providerKovan)
  const blockNumbers = useMemo(
    () => [
      // blockNumberEthereum,
      // blockNumberPolygon,
      // blockNumberArbitrum,
      blockNumberPolygonTestnet,
      blockNumberRinkeby,
      // blockNumberRopsten,
      // blockNumberGorli,
      // blockNumberKovan,
    ],
    [
      // blockNumberEthereum,
      // blockNumberPolygon,
      // blockNumberArbitrum,
      blockNumberPolygonTestnet,
      blockNumberRinkeby,
      // blockNumberRopsten,
      // blockNumberGorli,
      // blockNumberKovan,
    ],
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
    <Provider store={store}>
      {/* <Updater chainId={ChainId.ETHEREUM} blockNumber={blockNumberEthereum} />/ */}
      {/* <Updater chainId={ChainId.BSC} blockNumber={blockNumberBsc} /> */}
      {/* <Updater chainId={ChainId.AVALANCHE} blockNumber={blockNumberAvalanche} /> */}
      {/* <Updater chainId={ChainId.POLYGON} blockNumber={blockNumberPolygon} /> */}
      {/* <Updater chainId={ChainId.ARBITRUM} blockNumber={blockNumberArbitrum} /> */}
      {/* <Updater chainId={ChainId.OPTIMISM} blockNumber={blockNumberOptimism} /> */}
      {/* <Updater chainId={ChainId.FANTOM} blockNumber={blockNumberFantom} /> */}
      <Updater chainId={ChainId.POLYGON_TESTNET} blockNumber={blockNumberPolygonTestnet} />
      <Updater chainId={ChainId.RINKEBY} blockNumber={blockNumberRinkeby} />
      {/* <Updater chainId={ChainId.ROPSTEN} blockNumber={blockNumberRopsten} /> */}
      {/* <Updater chainId={ChainId.GÖRLI} blockNumber={blockNumberGorli} /> */}
      {/* <Updater chainId={ChainId.KOVAN} blockNumber={blockNumberKovan} /> */}
      <Component {...pageProps} blockNumbers={blockNumbers} chainIds={SUPPORTED_CHAIN_IDS} />
    </Provider>
  )
}

export default MyApp
