import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { useAddLiquidityDerivedInputError } from 'app/features/trident/add/useAddLiquidityDerivedState'

import TransactionDetails from './TransactionDetails'

const ClassicStandardAside = () => {
  const { i18n } = useLingui()
  const error = useAddLiquidityDerivedInputError()

  return (
    <div className="flex flex-col p-10 rounded bg-dark-1000 shadow-lg gap-20">
      <div className="flex flex-col gap-3">
        <Typography variant="h3" className="text-high-emphesis">
          {i18n._(t`Standard Mode`)}
        </Typography>
        <Typography variant="sm">
          {i18n._(
            t`Select any asset from your wallet or BentoBox balance to invest in this pool.  That asset will be split and converted into the pool assets and deposited in equal value.`
          )}
        </Typography>
      </div>
      <div className={error ? 'opacity-50' : 'opacity-100'}>
        <TransactionDetails />
      </div>
    </div>
  )
}

export default ClassicStandardAside
