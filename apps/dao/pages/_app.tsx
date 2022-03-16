import { FC } from 'react'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { ChainId } from '../constants'
import { getProvider, useLatestBlock } from '../hooks'
import { store } from '../store'
import { Updater } from '../Updater'
const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const providerMainnet = getProvider(ChainId.MAINNET)
  const providerRinkeby = getProvider(ChainId.RINKEBY)
  const blockNumberMainnet = useLatestBlock(providerMainnet)
  const blockNumberRinkeby = useLatestBlock(providerRinkeby)
  const chainIds = useMemo(() => [ChainId.MAINNET, ChainId.RINKEBY], [])
  const blockNumbers = useMemo(() => [blockNumberMainnet, blockNumberRinkeby], [blockNumberMainnet, blockNumberRinkeby])
  return (
    <Provider store={store}>
      <Updater chainId={ChainId.MAINNET} blockNumber={blockNumberMainnet} />
      <Updater chainId={ChainId.RINKEBY} blockNumber={blockNumberRinkeby} />
      <Component {...pageProps} blockNumbers={blockNumbers} chainIds={chainIds} />
    </Provider>
  )

  return
}

export default MyApp
