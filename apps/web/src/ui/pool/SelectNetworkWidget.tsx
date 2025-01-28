import { Button, FormSection, SelectIcon } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, { FC, memo } from 'react'
import { NetworkSelector } from 'src/lib/wagmi/components/network-selector'
import { EvmChainId, evmChainName } from 'sushi/chain'

interface SelectNetworkWidgetProps {
  networks: readonly EvmChainId[]
  selectedNetwork: EvmChainId
  onSelect(chainId: EvmChainId): void
  title?: string
}

export const SelectNetworkWidget: FC<SelectNetworkWidgetProps> = memo(
  function SelectNetworkWidget({
    selectedNetwork,
    onSelect,
    networks,
    title: _title,
  }) {
    return (
      <FormSection
        title="Network"
        description="Select the network you would like to provide liquidity on."
      >
        <div>
          <NetworkSelector
            networks={networks}
            selected={selectedNetwork}
            onSelect={onSelect}
          >
            <Button variant="secondary" className="!font-medium">
              <NetworkIcon chainId={selectedNetwork} width={16} height={16} />
              {evmChainName?.[selectedNetwork]}
              <SelectIcon />
            </Button>
          </NetworkSelector>
        </div>
      </FormSection>
    )
  },
)
