import KashiMediumRiskLendingPair from 'app/features/kashi/KashiMediumRiskLendingPair'
import { createContext, FC, useContext, useMemo } from 'react'

interface KashiMarketContext {
  market: KashiMediumRiskLendingPair
}

const Context = createContext<KashiMarketContext | undefined>(undefined)

export const KashiMarketProvider: FC<KashiMarketContext> = ({ market, children }) => {
  return <Context.Provider value={useMemo(() => ({ market }), [market])}>{children}</Context.Provider>
}

export const useKashiMarket = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Hook can only be used inside Kashi Market Context')
  }

  return context
}
