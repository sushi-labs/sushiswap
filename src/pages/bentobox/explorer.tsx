import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { TridentBody, TridentHeader } from 'app/layouts/Trident'
import React, { FC } from 'react'

const BentoBox: FC = () => {
  const { i18n } = useLingui()
  return (
    <>
      <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
        <div>
          <Typography variant="h2" className="text-high-emphesis" weight={700}>
            {i18n._(t`BentoBox Explorer`)}
          </Typography>
          <Typography variant="sm" weight={400}>
            {i18n._(t`Explore the BentoBox`)}
          </Typography>
        </div>
      </TridentHeader>
      <TridentBody>Test...</TridentBody>
    </>
  )
}

export default BentoBox
