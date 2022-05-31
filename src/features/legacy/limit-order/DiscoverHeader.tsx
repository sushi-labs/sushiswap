import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Button from 'app/components/Button'
import Typography from 'app/components/Typography'
import { TridentHeader } from 'app/layouts/Trident'
import Link from 'next/link'
import React from 'react'

const DiscoverHeader = () => {
  const { i18n } = useLingui()

  return (
    <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-chevron">
      <div>
        <Typography variant="h2" className="text-high-emphesis" weight={700}>
          {i18n._(t`Limit Orders`)}
        </Typography>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Place a limit order or check the status of your past orders`)}
        </Typography>
      </div>
      <div className="flex gap-3">
        <Link href="/limit-order" passHref={true}>
          <Button size="sm" color="blue">
            {i18n._(t`Create Order`)}
          </Button>
        </Link>
      </div>
    </TridentHeader>
  )
}

export default DiscoverHeader
