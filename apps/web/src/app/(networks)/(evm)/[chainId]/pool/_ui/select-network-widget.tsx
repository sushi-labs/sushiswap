import { Button, FormSection, SelectIcon } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import React, { type FC, memo } from 'react'
import { NetworkSelector } from 'src/lib/wagmi/components/network-selector'
import { type EvmChainId, getEvmChainById } from 'sushi/evm'

interface SelectNetworkWidgetProps {
  networks: readonly EvmChainId[]
  selectedNetwork: EvmChainId
  onSelect(chainId: EvmChainId): void
  title?: string
  description?: string
}

export const SelectNetworkWidget: FC<SelectNetworkWidgetProps> = memo(
  function SelectNetworkWidget({
    selectedNetwork,
    onSelect,
    networks,
    description = 'Select the network you would like to provide liquidity on.',
  }) {
    return (
      <FormSection title="Network" description={description}>
        <div>
          <NetworkSelector
            networks={networks}
            selected={selectedNetwork}
            onSelect={onSelect}
          >
            <Button variant="secondary" className="!font-medium">
              <NetworkIcon chainId={selectedNetwork} width={16} height={16} />
              {getEvmChainById(selectedNetwork).name}
              <SelectIcon />
            </Button>
          </NetworkSelector>
        </div>
      </FormSection>
    )
  },
)
