'use client'

import { Button, Card, Tabs, TabsList, TabsTrigger } from '@sushiswap/ui'
import { useState } from 'react'
import {
  CROSSMINT_STAGING_XMEME,
  CrossmintBuyButton,
  type CrossmintCheckoutToken,
} from 'src/lib/crossmint'
import { EvmChainId, USDC } from 'sushi/evm'
import { SVM_USDC, SvmChainId } from 'sushi/svm'

type BuyKind = 'memecoin' | 'stablecoin'
type StablecoinNetwork = 'base' | 'solana'

export function CrossmintBuyFlow() {
  const [buyKind, setBuyKind] = useState<BuyKind>('memecoin')
  const [stablecoinNetwork, setStablecoinNetwork] =
    useState<StablecoinNetwork>('base')
  const token: CrossmintCheckoutToken =
    buyKind === 'memecoin'
      ? CROSSMINT_STAGING_XMEME
      : stablecoinNetwork === 'base'
        ? USDC[EvmChainId.BASE]
        : SVM_USDC[SvmChainId.SOLANA]

  function handleBuyKindChange(value: string): void {
    if (value === 'memecoin' || value === 'stablecoin') {
      setBuyKind(value)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-4">
        <Tabs value={buyKind} onValueChange={handleBuyKindChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="memecoin">Memecoin</TabsTrigger>
            <TabsTrigger value="stablecoin">Stablecoin</TabsTrigger>
          </TabsList>
        </Tabs>

        {buyKind === 'stablecoin' ? (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Example token</legend>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={stablecoinNetwork === 'base' ? 'default' : 'secondary'}
                onClick={() => setStablecoinNetwork('base')}
              >
                USDC · Base
              </Button>
              <Button
                type="button"
                variant={
                  stablecoinNetwork === 'solana' ? 'default' : 'secondary'
                }
                onClick={() => setStablecoinNetwork('solana')}
              >
                USDC · Solana
              </Button>
            </div>
          </fieldset>
        ) : (
          <div className="rounded-xl border border-accent bg-secondary/50 p-4">
            <div className="text-sm font-medium">XMEME · Solana</div>
            <p className="mt-1 text-xs text-muted-foreground">
              The route supplies a Sushi token. The reusable checkout derives
              its network and Crossmint staging target from that token.
            </p>
          </div>
        )}

        <CrossmintBuyButton
          buttonProps={{ className: 'w-full', size: 'xl' }}
          token={token}
        >
          Buy {token.symbol} with fiat
        </CrossmintBuyButton>
      </Card>
    </div>
  )
}
