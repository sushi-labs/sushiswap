import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ChainId } from '@sushiswap/core-sdk'
// @ts-ignore TYPE NEEDS FIXING
import transakSDK from '@transak/transak-sdk'
import { useActiveWeb3React } from 'app/services/web3'
import { useCallback } from 'react'

const DEFAULT_NETWORK = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'bsc',
  [ChainId.MATIC]: 'matic',
}

const DEFAULT_CRYPTO_CURRENCY = {
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.BSC]: 'BNB',
  [ChainId.MATIC]: 'MATIC',
}

export default function Buy() {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  useCallback(() => {
    // @ts-ignore TYPE NEEDS FIXING
    if (!(chainId in DEFAULT_NETWORK)) {
      return
    }

    const transak = new transakSDK({
      apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY, // Your API Key
      environment: process.env.NEXT_PUBLIC_TRANSAK_ENVIRONMENT, // STAGING/PRODUCTION
      walletAddress: account,
      fiatCurrency: '', // INR/GBP
      // email: '', // Your customer's email address
      redirectURL: '',
      hostURL: window.location.origin,
      themeColor: '#0D0415',
      widgetHeight: '680px',
      widgetWidth: '100%',
      // @ts-ignore TYPE NEEDS FIXING
      defaultNetwork: DEFAULT_NETWORK[chainId],
      // @ts-ignore TYPE NEEDS FIXING
      defaultCryptoCurrency: DEFAULT_CRYPTO_CURRENCY[chainId],
    })

    transak.init()

    // To get all the events
    // @ts-ignore TYPE NEEDS FIXING
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log('ALL_EVENTS', data)
    })

    // This will trigger when the user closed the widget
    // @ts-ignore TYPE NEEDS FIXING
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      console.log('TRANSAK_WIDGET_CLOSE', orderData)
      transak.close()
    })

    // This will trigger when the user marks payment is made.
    // @ts-ignore TYPE NEEDS FIXING
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log('TRANSAK_ORDER_SUCCESSFUL', orderData)
      transak.close()
    })
  }, [account, chainId])

  return (
    <a
      id={`buy-link`}
      className="p-2 text-baseline text-primary hover:text-high-emphesis focus:text-high-emphesis md:p-3 whitespace-nowrap"
    >
      {i18n._(t`Buy`)}
    </a>
  )
}
