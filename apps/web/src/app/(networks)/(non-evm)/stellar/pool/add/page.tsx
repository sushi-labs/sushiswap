'use client'

import { FormSection } from '@sushiswap/ui'
import { type ReactElement, useState } from 'react'
import { FeeTierCard } from 'src/lib/components/fee-tier-card'
import { SelectTokensWidget } from 'src/lib/components/select-tokens-widget'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { StellarChainId, type StellarToken } from 'sushi/stellar'
import { isAddressLower } from '~stellar/_common/lib/soroban/constants'
import { DEFAULT_FEE_TIER, FEE_TIERS } from '~stellar/_common/lib/utils/ticks'
import { PoolPositionForm } from './_ui/pool-position-form'

export default function AddPoolPage(): ReactElement {
  const account = useAccount('stellar')
  const [token0, setToken0] = useState<StellarToken>()
  const [token1, setToken1] = useState<StellarToken>()
  const [fee, setFee] = useState<number>(DEFAULT_FEE_TIER)
  const [busy, setBusy] = useState(false)
  const distinct = token0 && token1 && token0.address !== token1.address
  const ordered =
    distinct && isAddressLower(token0.address, token1.address)
      ? [token0, token1]
      : [token1, token0]
  return (
    <fieldset disabled={busy} className="min-w-0">
      <SelectTokensWidget
        chainId={StellarChainId.STELLAR}
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
      >
        {token0 && token1 && !distinct && (
          <p role="alert" className="text-sm text-red">
            Select two different tokens.
          </p>
        )}
      </SelectTokensWidget>
      <FormSection
        title="Fee tier"
        description="Choose a fee tier for your pair. Lower fees suit stable pairs; higher fees suit more volatile pairs."
      >
        <div
          className="grid grid-cols-2 gap-4"
          role="group"
          aria-label="Fee tier"
        >
          {FEE_TIERS.map((tier) => (
            <FeeTierCard
              key={tier.value}
              fee={tier.value}
              description={tier.description}
              selected={fee === tier.value}
              disabled={!distinct}
              onSelect={() => setFee(tier.value)}
            />
          ))}
        </div>
      </FormSection>
      {distinct && ordered[0] && ordered[1] ? (
        <PoolPositionForm
          key={`${token0.id}:${token1.id}:${fee}:${account ?? ''}`}
          token0={ordered[0]}
          token1={ordered[1]}
          fee={fee}
          busy={busy}
          onBusyChange={setBusy}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          Select two different tokens to set the price range and deposit
          amounts.
        </p>
      )}
    </fieldset>
  )
}
