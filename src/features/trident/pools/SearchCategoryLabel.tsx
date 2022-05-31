import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { selectTridentPools } from 'app/features/trident/pools/poolsSlice'
import { useAppSelector } from 'app/state/hooks'
import Image from 'next/image'
import React, { FC } from 'react'

export const SearchCategoryLabel: FC = () => {
  const { i18n } = useLingui()
  const { searchQuery } = useAppSelector(selectTridentPools)

  console.log({ searchQuery })
  return (
    <div className="flex flex-row items-center justify-between px-2 py-2">
      <Typography variant="base" className="text-high-emphesis" weight={700}>
        {searchQuery ? `${i18n._(t`Search results for`)} '${searchQuery}'` : i18n._(t`Top Liquidity Pools`)}
      </Typography>
      <div className="flex gap-1">
        <Image src={'https://app.sushi.com/images/rss.svg'} width={16} height={16} alt="rss icon" />
        <div className="text-xs text-secondary">{i18n._(t`*Pairs with this symbol have a TWAP oracle.`)}</div>
      </div>
    </div>
  )
}
