'use client'

import { Button, FormSection, SelectIcon } from '@sushiswap/ui'
import type { KvmToken } from 'sushi/kvm'
import { usePoolDispatch, usePoolState } from '../../../../pool/pool-provider'
import { Icon } from '../../General/Icon'
import { TokenSelector } from '../../General/TokenSelector'

export const SelectTokensForm = () => {
  const { token0, token1 } = usePoolState()
  const { setToken0, setToken1 } = usePoolDispatch()

  return (
    <FormSection
      title="Tokens"
      description="Which token pair would you like to add liquidity to."
    >
      <div className="flex gap-3">
        <TokenSelector
          selected={token0}
          onSelect={(token) => setToken0(token as KvmToken)}
        >
          <Button
            icon={() =>
              token0 ? <Icon currency={token0} width={16} height={16} /> : <></>
            }
            variant="secondary"
          >
            <span>{token0?.symbol ?? 'Select Token'}</span>
            <div>
              <SelectIcon />
            </div>
          </Button>
        </TokenSelector>
        <TokenSelector
          selected={token1}
          onSelect={(token) => setToken1(token as KvmToken)}
        >
          <Button
            icon={() =>
              token1 ? <Icon currency={token1} width={16} height={16} /> : <></>
            }
            variant="secondary"
          >
            <span>{token1?.symbol ?? 'Select Token'}</span>
            <div>
              <SelectIcon />
            </div>
          </Button>
        </TokenSelector>
      </div>
    </FormSection>
  )
}
