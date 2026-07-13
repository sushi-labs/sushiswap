'use client'

import { createErrorToast } from '@sushiswap/notifications'
import { Button, SkeletonCircle, SkeletonText } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { type FC, useCallback } from 'react'
import { getNetworkName } from 'src/lib/network'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useResolvedChainId } from 'src/lib/wagmi/hooks/wallet/use-resolved-chain-id'
import { useSwitchChain } from 'src/lib/wallet'
import type { ChainId } from 'sushi'
import { isEvmChainId } from 'sushi/evm'
import { ProviderRpcError } from 'viem'
import {
  NetworkSelector,
  type NetworkSelectorOnSelectCallback,
} from './network-selector'

export const HeaderNetworkSelector: FC<{
  networks?: readonly ChainId[]
  selectedNetwork?: ChainId
  isLoading?: boolean
  onChange?(network: ChainId): void
  hideNetworkName?: boolean
  className?: string
}> = ({
  networks,
  selectedNetwork,
  isLoading = false,
  onChange,
  className,
  hideNetworkName = false,
}) => {
  const { mutateAsync: switchChainAsync } = useSwitchChain()
  const { chainId, connectedChainId } = useResolvedChainId(selectedNetwork)

  const onSwitchNetwork = useCallback<NetworkSelectorOnSelectCallback>(
    async (el, close) => {
      console.debug('onSwitchNetwork', el)
      try {
        if (
          typeof el === 'number' &&
          isEvmChainId(el) &&
          switchChainAsync &&
          connectedChainId !== el
        ) {
          await switchChainAsync({ chainId: el })
        }

        if (chainId !== el && onChange) {
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
    [chainId, connectedChainId, onChange, switchChainAsync],
  )

  return (
    <NetworkSelector
      selected={chainId}
      onSelect={onSwitchNetwork}
      networks={networks}
      isLoading={isLoading}
    >
      <Button
        variant="secondary"
        testId="network-selector"
        className={className}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-label={isLoading ? 'Restoring wallet network' : undefined}
      >
        {isLoading ? (
          <>
            <SkeletonCircle radius={20} />
            {hideNetworkName ? null : (
              <div className="relative hidden xl:block">
                <div className="invisible">{getNetworkName(chainId)}</div>
                <div className="absolute inset-0 flex items-center">
                  <SkeletonText fontSize="sm" />
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <NetworkIcon chainId={chainId} width={20} height={20} />
            {hideNetworkName ? null : (
              <div className="hidden xl:block">{getNetworkName(chainId)}</div>
            )}
          </>
        )}
      </Button>
    </NetworkSelector>
  )
}
