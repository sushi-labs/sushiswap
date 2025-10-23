'use client'

import {
  type PoolChainId,
  PoolChainIds,
  type PortfolioV2Protocol,
} from '@sushiswap/graph-client/data-api'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useLiquidityPositions } from 'src/lib/wagmi/hooks/portfolio/use-liquidity-positions'
import { useAccount } from 'wagmi'

interface State {
  mutate: {
    setChainIds(ids: PoolChainId[]): void
    setProtocols(protocols: PortfolioV2Protocol[]): void
  }
  state: {
    chainIds: PoolChainId[]
    protocols: PortfolioV2Protocol[]
    lpPositionQuery: ReturnType<typeof useLiquidityPositions>
  }
}

const LPPositionContext = createContext<State>({} as State)

interface LPPositionProviderProps {
  children: React.ReactNode
}
export const DEFAULT_LP_CHAIN_IDS = PoolChainIds.map((chainId) => chainId)
export const DEFAULT_LP_PROTOCOLS = [
  'V2',
  'V3',
  'V4',
  'BLADE',
] as PortfolioV2Protocol[]

const LPPositionProvider: FC<LPPositionProviderProps> = ({ children }) => {
  const [chainIds, _setChainIds] = useState<PoolChainId[]>(DEFAULT_LP_CHAIN_IDS)
  const [protocols, _setProtocols] =
    useState<PortfolioV2Protocol[]>(DEFAULT_LP_PROTOCOLS)
  const { address } = useAccount()

  const lpPositionQuery = useLiquidityPositions({
    // address: '0x23DefC2Ca207e7FBD84AE43B00048Fb5Cb4DB5B2',
    address: address,
    chainIds,
    protocols,
  })

  const setChainIds = useCallback((ids: PoolChainId[]) => {
    _setChainIds(ids)
  }, [])

  const setProtocols = useCallback((protocols: PortfolioV2Protocol[]) => {
    _setProtocols(protocols)
  }, [])

  return (
    <LPPositionContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setChainIds,
            setProtocols,
          },
          state: {
            chainIds,
            protocols,
            lpPositionQuery,
          },
        }
      }, [chainIds, protocols, setChainIds, setProtocols, lpPositionQuery])}
    >
      {children}
    </LPPositionContext.Provider>
  )
}

const useLPPositionContext = () => {
  const context = useContext(LPPositionContext)
  if (!context) {
    throw new Error('Hook can only be used inside LPPosition Context')
  }

  return context
}

export { LPPositionProvider, useLPPositionContext }
