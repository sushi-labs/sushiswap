'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import { type FC, useCallback, useState } from 'react'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import type { EvmCurrency } from 'sushi/evm'
import { BladeAddSectionWidget } from './blade-add-section-widget'

interface TokenInput {
  token: EvmCurrency | undefined
  amount: string
}
export const BladeAddSection: FC<{ pool: BladePool }> = ({ pool }) => {
  const chainId = pool.chainId

  const [inputs, setInputs] = useState<TokenInput[]>([
    { token: undefined, amount: '' },
  ])

  const onRemoveToken = useCallback(
    (index: number) => {
      if (inputs.length <= 1) return

      setInputs((prev) => prev.filter((_, i) => i !== index))
    },
    [inputs.length],
  )

  return (
    <CheckerProvider>
      <BladeAddSectionWidget
        chainId={chainId}
        inputs={inputs}
        onRemoveToken={onRemoveToken}
      >
        <Button className="w-full" size="xl" disabled>
          Blade Pools Are Withdrawal-Only
        </Button>
      </BladeAddSectionWidget>
    </CheckerProvider>
  )
}
