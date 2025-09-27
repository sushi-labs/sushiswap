'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import type { FC } from 'react'
import { InfoCard } from './info-card'

interface BladeHighlightsProps {
  pool: BladePool
}

export const BladeHighlights: FC<BladeHighlightsProps> = () => {
  return (
    <div
      className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3 pt-16"
      id="highlights"
    >
      <InfoCard
        title="Superior Profit-Based Yields"
        description={`Your yield is profit-based. Blade generates LP yields by making smart trades, not by charging fees while disguising your losses as "impermanent."`}
        buttonText="How Blade Generates Superior Yields?"
        glowClassName="bg-[#B3EDFE]"
        href="#"
      />
      <InfoCard
        title="No Impermanent Loss"
        description="Blade rebalances your liquidity faster than bots, so you never experience Impermanent Loss. It's not magic, it's offchain computation combined with onchain proof."
        buttonText="What Is No Impermanent Loss Benchmark?"
        glowClassName="bg-[#D1B6ED]"
        href="#"
      />
      <InfoCard
        title="MEV-Proof"
        description={`Your yield is profit-based. Blade generates LP yields by making smart trades, not by charging fees while disguising your losses as "impermanent."`}
        buttonText="Learn more about Blade's FMM Design"
        glowClassName="bg-[#B3EDFE]"
        href="#"
      />
    </div>
  )
}
