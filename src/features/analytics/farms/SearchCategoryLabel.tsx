import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from 'app/components/Typography'
import { selectFarms } from 'app/state/farms'
import { useAppSelector } from 'app/state/hooks'
import React, { FC } from 'react'

export const SearchCategoryLabel: FC = () => {
  const { i18n } = useLingui()
  const { searchQuery } = useAppSelector(selectFarms)
  return (
    <div className="flex flex-row items-center justify-between px-2 py-2">
      <Typography variant="base" className="text-high-emphesis" weight={700}>
        {searchQuery ? `${i18n._(t`Search results for`)} '${searchQuery}'` : i18n._(t`Top Farms`)}
      </Typography>
    </div>
  )
}
