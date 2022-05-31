import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { AllLiquidityPositionsBalances } from 'app/features/account/AssetBalances/liquidityPositions'
import HeaderDropdown from 'app/features/portfolio/HeaderDropdown'
import TridentLayout, { TridentBody, TridentHeader } from 'app/layouts/Trident'
import { useRouter } from 'next/router'
import React from 'react'

const LiquidityPosition = () => {
  const { i18n } = useLingui()
  const router = useRouter()

  const account = router.query.account as string
  const chainId = router.query.account ? Number(router.query.chainId) : undefined

  if (!account || !chainId) return null

  return (
    <>
      <TridentHeader pattern="bg-binary">
        <HeaderDropdown account={account} chainId={chainId} />
      </TridentHeader>
      <TridentBody>
        <Typography variant="lg" className="text-high-emphesis" weight={700}>
          {i18n._(t`Sushi Liquidity Positions`)}
        </Typography>
        <div className="flex flex-col justify-between gap-8">
          <AllLiquidityPositionsBalances account={account} chainId={chainId} />
        </div>
      </TridentBody>
    </>
  )
}

LiquidityPosition.Layout = TridentLayout

export default LiquidityPosition
