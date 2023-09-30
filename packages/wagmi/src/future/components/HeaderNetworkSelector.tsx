import { Chain, ChainId } from '@sushiswap/chain'
import { NetworkSelector, NetworkSelectorOnSelectCallback } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { createErrorToast } from '@sushiswap/ui/components/toast'
import React, { FC, Suspense, useCallback } from 'react'
import { ProviderRpcError, UserRejectedRequestError } from 'viem'
import { useNetwork, useSwitchNetwork } from 'wagmi'

export const HeaderNetworkSelector: FC<{
  networks: ChainId[]
  selectedNetwork?: ChainId
  onChange?(chainId: ChainId): void
}> = ({ networks, selectedNetwork, onChange }) => {
  const { switchNetworkAsync } = useSwitchNetwork()
  const { chain } = useNetwork()

  const onSwitchNetwork = useCallback<NetworkSelectorOnSelectCallback>(
    async (el, close) => {
      console.debug('onSwitchNetwork', el)
      try {
        if (switchNetworkAsync && chain?.id !== el) {
          await switchNetworkAsync(el)
        }

        if (selectedNetwork !== el && onChange) {
          onChange(el)
        }

        close()
      } catch (e) {
        if (e instanceof UserRejectedRequestError) return
        if (e instanceof ProviderRpcError) {
          createErrorToast(e.message, true)
        }
      }
    },
    [chain?.id, onChange, selectedNetwork, switchNetworkAsync]
  )

  const selected = selectedNetwork || (chain?.id as ChainId) || ChainId.ETHEREUM

  return (
    <NetworkSelector selected={selected} onSelect={onSwitchNetwork} networks={networks}>
      <Button variant="secondary" testId="network-selector">
        <Suspense fallback={null}>
          <NetworkIcon chainId={selected} width={20} height={20} />
          <div className="hidden xl:block">{Chain.from(selected)?.name}</div>
        </Suspense>
      </Button>
    </NetworkSelector>
  )
}
