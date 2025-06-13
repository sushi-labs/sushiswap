'use client'
import { Button, FormSection, SelectIcon } from '@sushiswap/ui'
import { Icon } from '../../General/Icon'
import { TokenSelector } from '../../General/TokenSelector'
import { usePoolDispatch, usePoolState } from '../pool-provider'

export const SelectTokensForm = () => {
  const { token0, token1 } = usePoolState()
  const { setToken0, setToken1 } = usePoolDispatch()

  return (
    <FormSection
      title="Tokens"
      description="Which token pair would you like to add liquidity to."
    >
      <div className="flex gap-3">
        <TokenSelector selected={token0} onSelect={setToken0}>
          <Button
            icon={() =>
              token0 ? <Icon currency={token0} width={16} height={16} /> : <></>
            }
            variant="secondary"
          >
            <span>{token0?.tokenSymbol ?? 'Select Token'}</span>
            <div>
              <SelectIcon />
            </div>
          </Button>
        </TokenSelector>
        <TokenSelector selected={token1} onSelect={setToken1}>
          <Button
            icon={() =>
              token1 ? <Icon currency={token1} width={16} height={16} /> : <></>
            }
            variant="secondary"
          >
            <span>{token1?.tokenSymbol ?? 'Select Token'}</span>
            <div>
              <SelectIcon />
            </div>
          </Button>
        </TokenSelector>
      </div>
    </FormSection>
  )
}
