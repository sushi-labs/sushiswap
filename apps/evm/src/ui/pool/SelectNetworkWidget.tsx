import { FormSection, NetworkSelector } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { SelectIcon } from '@sushiswap/ui/components/select'
import React, { FC, memo } from 'react'
import { ChainId, chainName } from 'sushi/chain'

interface SelectNetworkWidgetProps {
  networks: ChainId[]
  selectedNetwork: ChainId
  onSelect(chainId: ChainId): void
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
              {chainName?.[selectedNetwork]}
              <SelectIcon />
            </Button>
          </NetworkSelector>
        </div>
      </FormSection>
    )
  },
)
