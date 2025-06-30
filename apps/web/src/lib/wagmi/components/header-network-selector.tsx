'use client'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { createErrorToast } from '@sushiswap/notifications'
import { Button } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useSearchParams } from 'next/navigation'
import React, {
  createContext,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { NonStandardChainId } from 'src/config'
import { getNetworkName } from 'src/lib/network'
import { type EvmChainId, isEvmChainId } from 'sushi/chain'
import { ProviderRpcError, UserRejectedRequestError } from 'viem'
import { useChainId, useSwitchChain } from 'wagmi'
import {
  NetworkSelector,
  type NetworkSelectorOnSelectCallback,
} from './network-selector'

type SupportedNetworks = readonly (EvmChainId | NonStandardChainId)[]

interface HeaderNetworkSelectorContextType {
  supportedNetworks: SupportedNetworks | null
  setSupportedNetworks: Dispatch<SetStateAction<SupportedNetworks | null>>
}

const HeaderNetworkSelectorContext =
  createContext<HeaderNetworkSelectorContextType>({
    supportedNetworks: null,
    setSupportedNetworks: () => {},
  })

export const useHeaderNetworkSelector = (
  supportedNetworks: SupportedNetworks | null,
) => {
  const context = useContext(HeaderNetworkSelectorContext)

  useEffect(() => {
    context.setSupportedNetworks(supportedNetworks)

    return () => {
      context.setSupportedNetworks(null)
    }
  }, [supportedNetworks, context])
}

export const HeaderNetworkSelectorProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [supportedNetworks, setSupportedNetworks] =
    useState<SupportedNetworks | null>(null)

  return (
    <HeaderNetworkSelectorContext.Provider
      value={{ supportedNetworks, setSupportedNetworks }}
    >
      {children}
    </HeaderNetworkSelectorContext.Provider>
  )
}

export const HeaderNetworkSelector: FC<{
  networks: SupportedNetworks
  supportedNetworks?: SupportedNetworks
  selectedNetwork?: EvmChainId | NonStandardChainId
  onChange?(network: EvmChainId | NonStandardChainId): void
  hideNetworkName?: boolean
  className?: string
}> = ({
  networks,
  supportedNetworks: propsSupportedNetworks,
  selectedNetwork,
  onChange,
  className,
  hideNetworkName = false,
}) => {
  const { switchChainAsync } = useSwitchChain()
  const chainId = useChainId()
  const { supportedNetworks: contextSupportedNetworks } = useContext(
    HeaderNetworkSelectorContext,
  )
  const supportedNetworks = useMemo(
    () => propsSupportedNetworks ?? contextSupportedNetworks ?? undefined,
    [propsSupportedNetworks, contextSupportedNetworks],
  )

  const searchParams = useSearchParams()
  const chainId0 = searchParams.get('chainId0')
  const network = chainId0
    ? chainId0
    : selectedNetwork
      ? selectedNetwork
      : chainId

  const onSwitchNetwork = useCallback<NetworkSelectorOnSelectCallback>(
    async (el, close) => {
      console.debug('onSwitchNetwork', el)
      try {
        if (
          typeof el === 'number' &&
          isEvmChainId(el) &&
          switchChainAsync &&
          chainId !== el
        ) {
          await switchChainAsync({ chainId: el })
        }

        if (selectedNetwork !== el && onChange) {
          onChange(el)
        }

        close()
      } catch (e) {
        console.error(`Failed to switch network: ${e}`)
        if (e instanceof UserRejectedRequestError) return
        if (e instanceof ProviderRpcError) {
          createErrorToast(e.message, true)
        }
      }
    },
    [chainId, onChange, selectedNetwork, switchChainAsync],
  )

  return (
    <NetworkSelector
      selected={selectedNetwork ?? chainId}
      supportedNetworks={supportedNetworks}
      onSelect={onSwitchNetwork}
      networks={networks}
    >
      <Button
        variant="secondary"
        testId="network-selector"
        className={className}
        icon={ChevronDownIcon}
        iconPosition="end"
      >
        <Suspense fallback={null}>
          <NetworkIcon chainId={network} width={20} height={20} />
          {hideNetworkName ? null : (
            <div className="hidden xl:block">
              {getNetworkName(selectedNetwork ?? chainId)}
            </div>
          )}
        </Suspense>
      </Button>
    </NetworkSelector>
  )
}
