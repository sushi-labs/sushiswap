import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import type { EvmChainId } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import type { SwapMode } from '../swap-mode-buttons'
import { crossChainSlots, getCrossChainEdgeConfig } from './cross-chain'
import { dcaSlots, getDcaEdgeConfig } from './dca'
import { getLimitEdgeConfig, limitSlots } from './limit'
import { getSimpleEdgeConfig, simpleSlots } from './simple'
import { UniversalSwapSwitch } from './universal-swap-switch'

const getTokenAsString = (token: Type | string | undefined) => {
  if (!token) return undefined
  return typeof token === 'string'
    ? token
    : token.isNative
      ? 'NATIVE'
      : token.wrapped.address
}

interface UniversalSwapProps {
  defaultMode?: SwapMode
  chainId: EvmChainId
  defaultToken0?: Type | string
}

export async function UniversalSwap({
  chainId,
  defaultMode = 'swap',
  defaultToken0,
}: UniversalSwapProps) {
  const defaultToken0String = getTokenAsString(defaultToken0)

  return (
    <CheckerProvider>
      <UniversalSwapSwitch
        defaultMode={defaultMode}
        chainId={chainId}
        defaultToken0={defaultToken0String}
        widgets={{
          swap: {
            slots: simpleSlots,
            config: (await getSimpleEdgeConfig()) || {},
          },
          limit: {
            slots: limitSlots,
            config: (await getLimitEdgeConfig()) || {},
          },
          dca: {
            slots: dcaSlots,
            config: (await getDcaEdgeConfig()) || {},
          },
          crossChain: {
            slots: crossChainSlots,
            config: (await getCrossChainEdgeConfig()) || {},
          },
        }}
      />
    </CheckerProvider>
  )
}
