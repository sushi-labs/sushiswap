import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { TridentHeader } from 'app/layouts/Trident'
import { useActiveWeb3React } from 'app/services/web3'
import Link from 'next/link'
import React, { FC } from 'react'

import Button from '../../../components/Button'
import Typography from '../../../components/Typography'

const HeaderButton: FC<{ title: string; linkTo: string; id?: string }> = ({ title, linkTo, id }) => (
  <Link href={linkTo} passHref={true}>
    <Button
      id={id}
      color="gradient"
      variant="outlined"
      className="flex-1 text-sm font-bold text-white sm:flex-none md:flex-1 h-9"
    >
      {title}
    </Button>
  </Link>
)

export const DiscoverHeader: FC = () => {
  const { i18n } = useLingui()
  const { account } = useActiveWeb3React()

  return (
    <TridentHeader className="sm:!flex-row justify-between items-center" pattern="bg-bubble">
      <div>
        <Typography variant="h2" className="text-high-emphesis" weight={700}>
          {i18n._(t`Provide liquidity & earn.`)}
        </Typography>
        <Typography variant="sm" weight={400}>
          {i18n._(t`Earn LP fees by depositing tokens to the platform.`)}
        </Typography>
      </div>
      <div className="flex gap-3">
        {account && (
          <Link href={`/account/liquidity?account=${account}`} passHref={true}>
            <Button color="blue" size="sm">
              {i18n._(t`My Positions`)}
            </Button>
          </Link>
        )}

        <Link href="/trident/create" passHref={true}>
          <Button id="btn-create-new-pool" size="sm">
            {i18n._(t`Create Pool`)}
          </Button>
        </Link>
      </div>
    </TridentHeader>
  )
}
