import {Chain, ChainId} from '@sushiswap/chain'
import {NetworkIcon} from '@sushiswap/ui/future/components/icons'
import {NetworkSelector, NetworkSelectorOnSelectCallback} from '@sushiswap/ui/future/components/networkselector'
import {createErrorToast} from '@sushiswap/ui/future/components/toast'
import {useBreakpoint} from '@sushiswap/ui/future/lib/useBreakpoint'
import React, {FC, useCallback} from 'react'
import {ProviderRpcError, useNetwork, UserRejectedRequestError, useSwitchNetwork} from 'wagmi'
import {SelectPrimitive} from "@sushiswap/ui/future/components/select";
import {Button} from "@sushiswap/ui/future/components/button";
import {ChevronDownIcon} from "@heroicons/react/20/solid";

export const HeaderNetworkSelector: FC<{
  networks: ChainId[]
  selectedNetwork?: ChainId
  onChange?(chainId: ChainId): void
}> = ({ networks, selectedNetwork, onChange }) => {
  const { switchNetworkAsync } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { isSm } = useBreakpoint('sm')

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
    <NetworkSelector
      selected={selected}
      variant={isSm ? 'menu' : 'dialog'}
      onSelect={onSwitchNetwork}
      networks={networks}
    >
      <SelectPrimitive.Trigger>
        <Button variant="outlined" color="default" size="md" className="!font-medium" testdata-id="network-selector-button">
          <NetworkIcon chainId={selected} width={20} height={20} />
          <div className="hidden xl:block">{Chain.from(selected).name}</div>
          <ChevronDownIcon
              width={24}
              height={24}
          />
        </Button>
      </SelectPrimitive.Trigger>
    </NetworkSelector>
  )
}
