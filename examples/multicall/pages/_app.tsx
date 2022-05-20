import '@sushiswap/ui/index.css'

import type { AppProps } from 'next/app'
import { FC, useMemo } from 'react'
import { Provider } from 'react-redux'

import { ChainId } from '../constants'
import { getProvider, useLatestBlock } from '../hooks'
import { store } from '../store'
import { Updater } from '../Updater'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const providerEthereum = getProvider(ChainId.ETHEREUM)
  const providerRinkeby = getProvider(ChainId.RINKEBY)
  const providerRopsten = getProvider(ChainId.ROPSTEN)
  const providerGorli = getProvider(ChainId.GÖRLI)
  const providerKovan = getProvider(ChainId.KOVAN)
  const blockNumberEthereum = useLatestBlock(providerEthereum)
  const blockNumberRinkeby = useLatestBlock(providerRinkeby)
  const blockNumberRopsten = useLatestBlock(providerRopsten)
  const blockNumberGorli = useLatestBlock(providerGorli)
  const blockNumberKovan = useLatestBlock(providerKovan)
  const chainIds = useMemo(() => [ChainId.ETHEREUM, ChainId.RINKEBY, ChainId.ROPSTEN, ChainId.GÖRLI, ChainId.KOVAN], [])
  const blockNumbers = useMemo(
    () => [blockNumberEthereum, blockNumberRinkeby, blockNumberRopsten, blockNumberGorli, blockNumberKovan],
    [blockNumberEthereum, blockNumberGorli, blockNumberKovan, blockNumberRinkeby, blockNumberRopsten]
  )
  return (
    <Provider store={store}>
      <Updater chainId={ChainId.ETHEREUM} blockNumber={blockNumberEthereum} />
      <Updater chainId={ChainId.RINKEBY} blockNumber={blockNumberRinkeby} />
      <Updater chainId={ChainId.ROPSTEN} blockNumber={blockNumberRopsten} />
      <Updater chainId={ChainId.GÖRLI} blockNumber={blockNumberGorli} />
      <Updater chainId={ChainId.KOVAN} blockNumber={blockNumberKovan} />
      <Component {...pageProps} blockNumbers={blockNumbers} chainIds={chainIds} />
    </Provider>
  )
}

export default MyApp
