'use client'

import {
  InterfaceEventName,
  WalletConnectionResult,
  sendAnalyticsEvent,
} from '@sushiswap/telemetry'
import { useState } from 'react'
import { useConnection, useConnect as useWagmiConnect } from 'wagmi'

export const useConnect = (props?: Parameters<typeof useWagmiConnect>[0]) => {
  const [pending, setPending] = useState(false)

  const { connectAsync, ...rest } = useWagmiConnect(props)
  const { connector } = useConnection()

  const _connectAsync = async (...args: Parameters<typeof connectAsync>) => {
    let result

    try {
      setPending(true)
      result = await connectAsync(...args)
      sendAnalyticsEvent(InterfaceEventName.WALLET_CONNECTED, {
        result: WalletConnectionResult.SUCCEEDED,
        wallet_address: result.accounts[0],
        wallet_type: args[0].connector.name,
        page: window.location,
      })

      return result
    } catch (e) {
      sendAnalyticsEvent(InterfaceEventName.WALLET_CONNECTED, {
        result: WalletConnectionResult.FAILED,
        wallet_type: connector?.name,
        page: window.location,
        error: e instanceof Error ? e.message : undefined,
      })
      console.error(e)
      throw e
    } finally {
      setPending(false)
    }
  }

  return {
    ...rest,
    connect: connectAsync,
    connectAsync: _connectAsync,
    pending,
  }
}
