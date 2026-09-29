'use client'

import { Button, Currency, FormSection, SelectIcon } from '@sushiswap/ui'
import { type ReactElement, useState } from 'react'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
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
    <fieldset disabled={busy} className="min-w-0 space-y-6">
      <FormSection
        title="Tokens"
        description="Select the token pair. If a pool exists, liquidity will be added to it."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { token: token0, setToken: setToken0 },
            { token: token1, setToken: setToken1 },
          ].map(({ token, setToken }, index) => (
            <TokenSelector
              key={index}
              id={`token${index}-selector`}
              chainId={StellarChainId.STELLAR}
              selected={token}
              onSelect={setToken}
            >
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                aria-label={`Select token ${index + 1}`}
              >
                {token && (
                  <Currency.Icon currency={token} width={24} height={24} />
                )}
                {token?.symbol ?? 'Select Token'}
                <SelectIcon />
              </Button>
            </TokenSelector>
          ))}
        </div>
        {token0 && token1 && !distinct && (
          <p role="alert" className="text-sm text-red">
            Select two different tokens.
          </p>
        )}
      </FormSection>
      <FormSection
        title="Fee Tier"
        description="Lower fees suit stable pairs. Higher fees suit more volatile pairs."
      >
        <div
          className="grid gap-3 sm:grid-cols-3"
          role="group"
          aria-label="Fee tier"
        >
          {FEE_TIERS.map((tier) => (
            <Button
              key={tier.value}
              type="button"
              variant={fee === tier.value ? 'default' : 'secondary'}
              aria-pressed={fee === tier.value}
              disabled={!distinct}
              onClick={() => setFee(tier.value)}
              testdata-id={`fee-option-${tier.value}`}
              className="h-auto flex-col whitespace-normal p-4"
            >
              <span>{tier.label}</span>
              <span className="text-xs font-normal">{tier.description}</span>
            </Button>
          ))}
        </div>
      </FormSection>
      {distinct && ordered[0] && ordered[1] ? (
        <PoolPositionForm
          key={`${token0.id}:${token1.id}:${fee}:${account ?? ''}`}
          token0={ordered[0]}
          token1={ordered[1]}
          fee={fee}
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
