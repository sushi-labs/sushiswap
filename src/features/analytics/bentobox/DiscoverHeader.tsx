import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { TridentHeader } from 'app/layouts/Trident'
import React, { FC } from 'react'

import Typography from '../../../components/Typography'

export const DiscoverHeader: FC = () => {
  const { i18n } = useLingui()
  return (
    <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
      <div>
        <Typography variant="h2" className="text-high-emphesis" weight={700}>
          {i18n._(t`BentoBox Analytics.`)}
        </Typography>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Click on the column name to sort BentoBox tokens by price, liquidity, volume, APY etc...`)}
        </Typography>
      </div>
    </TridentHeader>
  )
}
