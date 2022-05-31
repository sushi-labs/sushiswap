import { I18n } from '@lingui/core'
import { t } from '@lingui/macro'
import { Pool } from '@sushiswap/trident-sdk'
import Chip from 'app/components/Chip'
import Typography from 'app/components/Typography'
import { formatPercent } from 'app/functions'
import { FC, useMemo } from 'react'

import { POOL_TYPES } from '../constants'
import { poolEntityMapper } from '../poolEntityMapper'
import { chipPoolColorMapper } from '../types'

const _PoolProperties: FC<{ pool: Pool; i18n: I18n }> = ({ pool, i18n }) => {
  const type = useMemo(() => poolEntityMapper(pool), [pool])
  return (
    <>
      <Chip label={POOL_TYPES[type].label_long} color={chipPoolColorMapper[type]} />
      <Typography weight={700} variant="sm">
        {formatPercent(pool?.fee?.valueOf() / 100)} {i18n._(t`Fees`)}
      </Typography>
    </>
  )
}

export const PoolProperties: FC<{ pool?: Pool; i18n: I18n }> = ({ pool, i18n }) => {
  if (!pool) return <></>
  return <_PoolProperties pool={pool} i18n={i18n} />
}
