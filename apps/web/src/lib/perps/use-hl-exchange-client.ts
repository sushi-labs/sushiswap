import { ExchangeClient } from '@nktkas/hyperliquid'
import { useMemo } from 'react'
import { useWalletClient } from 'wagmi'
import { hlHttpTransport } from './config'

export const useHlExchangeClient = () => {
  const { data: walletClient } = useWalletClient()
  const hlExchangeClient = useMemo(() => {
    if (!walletClient) return null

    return new ExchangeClient({
      transport: hlHttpTransport,
      wallet: walletClient,
    })
  }, [walletClient])

  return { hlExchangeClient }
}
