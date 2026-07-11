'use client'

import { RadioGroup } from '@headlessui/react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  FormSection,
  Toggle,
} from '@sushiswap/ui'
import type { Dispatch, ReactElement, SetStateAction } from 'react'
import type { StellarToken } from 'sushi/stellar'
import { FEE_TIERS } from '~stellar/_common/lib/utils/ticks'

interface SelectStellarPoolFeeWidgetProps {
  token0: StellarToken | undefined
  token1: StellarToken | undefined
  selectedFee: number
  setSelectedFee: Dispatch<SetStateAction<number>>
}

export function SelectStellarPoolFeeWidget({
  token0,
  token1,
  selectedFee,
  setSelectedFee,
}: SelectStellarPoolFeeWidgetProps): ReactElement {
  function handleFeeChange(fee: number): void {
    setSelectedFee(fee)
  }

  return (
    <FormSection
      title="Fee Tier"
      description="Some fee tiers work better than others depending on the volatility of your pair. Lower fee tiers generally work better when pairing stable coins. Higher fee tiers generally work better when pairing exotic coins."
    >
      <div className="grid gap-2">
        <RadioGroup
          value={selectedFee}
          onChange={handleFeeChange}
          className="grid grid-cols-2 gap-4"
          disabled={!token0 || !token1}
        >
          {FEE_TIERS.map((tier) => (
            <Toggle
              pressed={selectedFee === tier.value}
              onClick={() => handleFeeChange(tier.value)}
              asChild
              key={tier.value}
              testdata-id={`fee-option-${tier.value}`}
              className="!h-[unset] !w-[unset] !p-0 !text-left !justify-start cursor-pointer dark:data-[state=on]:bg-secondary"
            >
              <Card>
                <CardHeader>
                  <CardTitle>
                    <span className="flex flex-wrap items-center gap-2">
                      <span>{tier.value / 10000}% Fees</span>
                    </span>
                  </CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
              </Card>
            </Toggle>
          ))}
        </RadioGroup>
      </div>
    </FormSection>
  )
}
