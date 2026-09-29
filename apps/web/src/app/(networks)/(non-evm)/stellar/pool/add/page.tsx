'use client'

import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Currency,
  FormSection,
  SelectIcon,
  Toggle,
} from '@sushiswap/ui'
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
    <fieldset disabled={busy} className="min-w-0">
      <FormSection
        title="Tokens"
        description="Which token pair would you like to add liquidity to?"
      >
        <div className="flex flex-wrap gap-3">
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
                color={!token && index === 1 ? 'blue' : 'default'}
                aria-label={`Select token ${index + 1}`}
              >
                {token && (
                  <Currency.Icon
                    disableLink
                    currency={token}
                    width={16}
                    height={16}
                  />
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
        title="Fee tier"
        description="Choose a fee tier for your pair. Lower fees suit stable pairs; higher fees suit more volatile pairs."
      >
        <div
          className="grid grid-cols-2 gap-4"
          role="group"
          aria-label="Fee tier"
        >
          {FEE_TIERS.map((tier) => (
            <Toggle
              key={tier.value}
              type="button"
              pressed={fee === tier.value}
              disabled={!distinct}
              onClick={() => setFee(tier.value)}
              testdata-id={`fee-option-${tier.value}`}
              className="!h-auto !w-auto !p-0 !text-left !justify-start items-stretch whitespace-normal bg-white dark:bg-background dark:data-[state=on]:bg-secondary"
            >
              <Card variant="outline" className="w-full text-left">
                <CardHeader>
                  <CardTitle>{tier.label} Fees</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
              </Card>
            </Toggle>
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
