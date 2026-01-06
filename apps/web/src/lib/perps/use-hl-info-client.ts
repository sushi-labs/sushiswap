import { InfoClient } from '@nktkas/hyperliquid'
import { useMemo } from 'react'

import { hlHttpTransport } from './config'

export const useHlInfoClient = () => {
  const hlInfoClient = useMemo(() => {
    return new InfoClient({ transport: hlHttpTransport })
  }, [])
  return { hlInfoClient }
}
