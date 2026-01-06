import { SubscriptionClient } from '@nktkas/hyperliquid'
import { useMemo } from 'react'
import { hlWebSocketTransport } from './config'

export const useHlSubClient = () => {
  const hlSubClient = useMemo(() => {
    return new SubscriptionClient({ transport: hlWebSocketTransport })
  }, [])
  return { hlSubClient }
}
