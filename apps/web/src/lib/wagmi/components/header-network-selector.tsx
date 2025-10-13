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
import { getNetworkName } from 'src/lib/network'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import type { ChainId } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import { ProviderRpcError } from 'viem'
import { useChainId, useSwitchChain } from 'wagmi'
import {
  NetworkSelector,
  type NetworkSelectorOnSelectCallback,
} from './network-selector'

type SupportedNetworks = readonly ChainId[]

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
  networks?: readonly ChainId[]
  selectedNetwork?: ChainId
  onChange?(network: ChainId): void
  hideNetworkName?: boolean
  className?: string
}> = ({
  networks,
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
    () => networks ?? contextSupportedNetworks ?? undefined,
    [networks, contextSupportedNetworks],
  )

  const searchParams = useSearchParams()
  const chainId0 = searchParams.get('chainId0')
  const network = chainId0
    ? (Number(chainId0) as ChainId)
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
        if (isUserRejectedError(e)) return
        if (e instanceof ProviderRpcError) {
          createErrorToast(e.message, true)
        }
      }
    },
    [chainId, onChange, selectedNetwork, switchChainAsync],
  )

  return (
    <NetworkSelector
      selected={network}
      networks={supportedNetworks}
      onSelect={onSwitchNetwork}
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
            <div className="hidden xl:block">{getNetworkName(network)}</div>
          )}
        </Suspense>
      </Button>
    </NetworkSelector>
  )
}
