import { Menu } from '@headlessui/react'
import { ChainId, chains } from '@sushiswap/chain'
import { Button } from '@sushiswap/ui13/components/button'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { NetworkSelector } from '@sushiswap/ui13/components/networkselector'
import { useBreakpoint } from '@sushiswap/ui13/lib/useBreakpoint'
import React, { FC, useCallback } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

export const HeaderNetworkSelector: FC<{ networks: ChainId[] }> = ({ networks }) => {
  const { switchNetwork } = useSwitchNetwork()
  const { chain } = useNetwork()
  const { isMd } = useBreakpoint('md')
  const onSwitchNetwork = useCallback(
    (el: ChainId) => {
      if (switchNetwork) {
        switchNetwork(el)
      }
    },
    [switchNetwork]
  )

  return (
    <NetworkSelector
      selected={chain?.id || ChainId.ETHEREUM}
      variant={isMd ? 'dialog' : 'menu'}
      onSelect={onSwitchNetwork}
      networks={networks}
    >
      {({ selected, setOpen }) =>
        isMd ? (
          <Button onClick={() => setOpen(true)} variant="outlined" color="default" size="md">
            <NetworkIcon chainId={selected} width={20} height={20} />
            <div className="hidden xl:block">{chains[selected].name.split(' ')[0]}</div>
          </Button>
        ) : (
          <Menu.Button onClick={() => setOpen(true)} as={Button} variant="outlined" color="default" size="md">
            <NetworkIcon chainId={selected} width={20} height={20} />
            <div className="hidden xl:block">{chains[selected].name.split(' ')[0]}</div>
          </Menu.Button>
        )
      }
    </NetworkSelector>
  )
}
