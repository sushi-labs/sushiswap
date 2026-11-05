'use client'

import {
  FormSection,
  Label,
  TextField,
  TextFieldDescription,
  classNames,
} from '@sushiswap/ui'
import { type ReactElement, useState } from 'react'
import { FeeTierCard } from 'src/lib/components/fee-tier-card'
import {
  SUSHISWAP_V4_MAX_LP_FEE,
  SUSHISWAP_V4_MAX_TICK_SPACING,
  SUSHISWAP_V4_MIN_TICK_SPACING,
  TICK_SPACINGS,
} from 'sushi/evm'
import { BASE_FEE_TIERS } from '~evm/[chainId]/pool/_ui/fee-tier-config'

export interface V4FeeConfig {
  /** LP fee in hundredths of a bip. */
  fee: number
  tickSpacing: number
}

// The standard fee tiers with the tick spacings V3 pairs them with
const PRESETS = BASE_FEE_TIERS.map(({ value, subtitle }) => ({
  fee: value,
  tickSpacing: TICK_SPACINGS[value],
  description: subtitle,
}))

function parseCustomConfig(
  fee: string,
  tickSpacing: string,
): V4FeeConfig | undefined {
  const feePercent = Number(fee)
  const spacing = Number(tickSpacing)
  if (!fee || !tickSpacing || !Number.isFinite(feePercent)) return undefined

  const feeUnits = Math.round(feePercent * 10_000)
  if (
    feeUnits < 0 ||
    feeUnits > SUSHISWAP_V4_MAX_LP_FEE ||
    !Number.isInteger(spacing) ||
    spacing < SUSHISWAP_V4_MIN_TICK_SPACING ||
    spacing > SUSHISWAP_V4_MAX_TICK_SPACING
  ) {
    return undefined
  }
  return { fee: feeUnits, tickSpacing: spacing }
}

interface SelectV4PoolConfigWidgetProps {
  config: V4FeeConfig | undefined
  setConfig(config: V4FeeConfig | undefined): void
  disabled: boolean
}

export function SelectV4PoolConfigWidget({
  config,
  setConfig,
  disabled,
}: SelectV4PoolConfigWidgetProps): ReactElement {
  const [customFee, setCustomFee] = useState('')
  const [customTickSpacing, setCustomTickSpacing] = useState('')
  const isCustom = customFee !== '' || customTickSpacing !== ''

  function onCustomChange(fee: string, tickSpacing: string): void {
    setCustomFee(fee)
    setCustomTickSpacing(tickSpacing)
    setConfig(parseCustomConfig(fee, tickSpacing))
  }

  return (
    <FormSection
      title="Fee tier"
      description="The fee liquidity providers earn on swaps, and the tick spacing that bounds how finely positions can be ranged. A pool exists per pair, fee and tick spacing."
    >
      <div
        className={classNames(
          'flex flex-col gap-4',
          disabled && 'opacity-40 pointer-events-none',
        )}
      >
        <div className="grid grid-cols-2 gap-4">
          {PRESETS.map((preset) => (
            <FeeTierCard
              key={preset.fee}
              fee={preset.fee}
              description={`${preset.description} Tick spacing ${preset.tickSpacing}.`}
              selected={
                !isCustom &&
                config?.fee === preset.fee &&
                config?.tickSpacing === preset.tickSpacing
              }
              onSelect={() => {
                // A later custom edit starts over rather than reviving these
                setCustomFee('')
                setCustomTickSpacing('')
                setConfig({ fee: preset.fee, tickSpacing: preset.tickSpacing })
              }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Custom</Label>
          <div className="flex gap-2">
            <TextField
              variant="outline"
              type="number"
              placeholder="Fee"
              unit="%"
              value={customFee}
              onValueChange={(value) =>
                onCustomChange(value, customTickSpacing)
              }
              testdata-id="custom-fee-input"
            />
            <TextField
              variant="outline"
              type="number"
              placeholder="Tick spacing"
              value={customTickSpacing}
              onValueChange={(value) => onCustomChange(customFee, value)}
              testdata-id="custom-tick-spacing-input"
            />
          </div>
          <TextFieldDescription>
            {`A fee of 0-${SUSHISWAP_V4_MAX_LP_FEE / 10_000}% and a whole tick spacing of ${SUSHISWAP_V4_MIN_TICK_SPACING}-${SUSHISWAP_V4_MAX_TICK_SPACING}.`}
          </TextFieldDescription>
        </div>
      </div>
    </FormSection>
  )
}
