import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'
import Typography from 'app/components/Typography'
import AssetBalances from 'app/features/portfolio/AssetBalances/AssetBalances'
import { useTridentLPTableConfig } from 'app/features/portfolio/AssetBalances/liquidityPositions/useTridentLPTableConfig'
import React from 'react'

import { useLegacyLiquidityPositionsBalances, useTridentLiquidityPositionsBalances } from './hooks'

interface PositionBalances {
  account: string
  chainId: number | undefined
}

export const AllLiquidityPositionsBalances = ({ account, chainId }: PositionBalances) => {
  const legacy = useLegacyLiquidityPositionsBalances({ account, chainId })
  const trident = useTridentLiquidityPositionsBalances({ account, chainId })

  const { config } = useTridentLPTableConfig({ positions: [...(legacy || []), ...(trident || [])], chainId })
  return <AssetBalances config={config} />
}

export const TridentLiquidityPositionsBalances = ({ account, chainId }: PositionBalances) => {
  const positions = useTridentLiquidityPositionsBalances({ account, chainId })

  const { config } = useTridentLPTableConfig({ positions, chainId })
  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`Trident`)}
      </Typography>
      <AssetBalances config={config} />
    </div>
  )
}

export const LegacyLiquidityPositionsBalances = ({ account, chainId }: PositionBalances) => {
  const positions = useLegacyLiquidityPositionsBalances({ account, chainId })

  const { config } = useTridentLPTableConfig({ positions, chainId })
  return (
    <div className="flex flex-col gap-3">
      <Typography weight={700} variant="lg" className="px-2 text-high-emphesis">
        {i18n._(t`Legacy`)}
      </Typography>
      <AssetBalances config={config} />
    </div>
  )
}
