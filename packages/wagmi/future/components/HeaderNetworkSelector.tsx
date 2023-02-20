import { Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChainId, chainName, chains } from '@sushiswap/chain'
import { classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/future/components/button'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { NetworkSelector, NetworkSelectorOnSelectCallback } from '@sushiswap/ui/future/components/networkselector'
import { createErrorToast } from '@sushiswap/ui/future/components/toast'
import { useBreakpoint } from '@sushiswap/ui/future/lib/useBreakpoint'
import React, { FC, useCallback } from 'react'
import { ProviderRpcError, useNetwork, UserRejectedRequestError, useSwitchNetwork } from 'wagmi'

export const HeaderNetworkSelector: FC<{ networks: ChainId[]; selectedNetwork?: ChainId }> = ({
  networks,
  selectedNetwork,
}) => {
  const { switchNetworkAsync } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { isSm } = useBreakpoint('sm')

  const onSwitchNetwork = useCallback<NetworkSelectorOnSelectCallback>(
    async (el, close) => {
      if (switchNetworkAsync) {
        try {
          await switchNetworkAsync(el)
          close()
        } catch (e) {
          if (e instanceof UserRejectedRequestError) return
          if (e instanceof ProviderRpcError) {
            createErrorToast(e.message, true)
          }
        }
      }
    },
    [switchNetworkAsync]
  )

  const selected = chain?.id || selectedNetwork || ChainId.ETHEREUM

  return (
    <NetworkSelector
      selected={selected}
      variant={isSm ? 'menu' : 'dialog'}
      onSelect={onSwitchNetwork}
      networks={networks}
    >
      {({ open }) => (
        <Popover.Button as={Button} variant="outlined" color="default" size="md" className="!font-medium">
          <NetworkIcon chainId={selected} width={20} height={20} />
          <div className="hidden xl:block">
            {chainName?.[selected]?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim()}
          </div>
          <ChevronDownIcon
            width={24}
            height={24}
            className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
          />
        </Popover.Button>
      )}
    </NetworkSelector>
  )
}
