import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { useAddDetails } from 'app/features/trident/add/useAddDetails'
import { usePoolContext } from 'app/features/trident/PoolContext'
import { FC } from 'react'

import TransactionDetailsExplanationModal from '../TransactionDetailsExplanationModal'

const TransactionDetails: FC = () => {
  const { i18n } = useLingui()
  const { poolWithState, poolBalance } = usePoolContext()
  const { price, poolShareBefore, liquidityMinted, poolShareAfter } = useAddDetails()

  return (
    <div className="flex flex-col gap-4 lg:gap-8">
      <div className="flex flex-row justify-between gap-2">
        <Typography weight={700} className="text-high-emphesis">
          {i18n._(t`Transaction Details`)}
        </Typography>
        <TransactionDetailsExplanationModal>
          <Typography weight={700} variant="sm" className="text-right text-blue">
            {i18n._(t`What do these mean?`)}
          </Typography>
        </TransactionDetailsExplanationModal>
      </div>
      <div className="flex flex-col gap-1">
        {poolWithState?.pool && (
          <>
            <div className="flex flex-row justify-between gap-2">
              <Typography variant="sm" className="text-secondary">
                1 {poolWithState.pool?.token0?.symbol}
              </Typography>
              <Typography weight={700} variant="sm" className="text-right text-high-emphesis">
                {price ? price.toSignificant(6) : '0.000'} {poolWithState.pool?.token1?.symbol}
              </Typography>
            </div>
            <div className="flex flex-row justify-between">
              <Typography variant="sm" className="text-secondary">
                1 {poolWithState.pool?.token1?.symbol}
              </Typography>
              <Typography weight={700} variant="sm" className="text-right text-high-emphesis">
                {price ? price.invert().toSignificant(6) : '0.000'} {poolWithState.pool?.token0?.symbol}
              </Typography>
            </div>
          </>
        )}
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Minimum Received`)}
          </Typography>
          <Typography id="text-liquidity-minted" weight={700} variant="sm" className="text-high-emphesis">
            {liquidityMinted?.toSignificant(6) || '0.000'} SLP
          </Typography>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Share`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-right text-high-emphesis">
            {poolShareBefore?.greaterThan(0) ? poolShareBefore?.toSignificant(6) : '0.000'}%
            {poolShareAfter?.greaterThan(0) && (
              <>
                → <span className="text-green">{poolShareAfter?.toSignificant(6) || '0.000'}%</span>
              </>
            )}
          </Typography>
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Typography variant="sm" className="text-secondary whitespace-nowrap">
            {i18n._(t`Your Pool Tokens`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-right text-high-emphesis">
            {poolBalance?.greaterThan(0) ? poolBalance?.toSignificant(6) : '0.000'}
            {liquidityMinted?.greaterThan(0) && (
              <>
                {' SLP '}→{' '}
                <span className="text-green">
                  {poolBalance && liquidityMinted ? poolBalance.add(liquidityMinted)?.toSignificant(6) : '0.000'} SLP
                </span>
              </>
            )}
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetails
