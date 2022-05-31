import { Fee } from '@sushiswap/trident-sdk'
import Typography from 'app/components/Typography'
import { classNames } from 'app/functions/styling'
import React, { FC } from 'react'

interface FeeTierSelectProps {
  tier: Fee
  subtitle: string
  selectedFeeTier?: Fee
  setter(x: Fee): void
}

export const FeeTierSelect: FC<FeeTierSelectProps> = ({ tier, subtitle, selectedFeeTier, setter }) => {
  const active = tier === selectedFeeTier

  return (
    <div
      id={`fee-tier-${tier}`}
      className={classNames(
        'border flex flex-col gap-1 rounded justify-center border p-5 border-dark-800 hover:cursor-pointer',
        active ? 'text-high-emphesis border-purple shadow-lg shadow-purple/10' : 'border transparent text-secondary'
      )}
      onClick={() => setter(tier)}
    >
      <Typography variant="h3" weight={700}>
        {tier / 100}%
      </Typography>
      <Typography variant="xs" weight={700} className={active ? 'text-primary' : 'text-low-emphesis'}>
        {subtitle}
      </Typography>
    </div>
  )
}
