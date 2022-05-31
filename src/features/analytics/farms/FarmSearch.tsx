import { SearchIcon } from '@heroicons/react/solid'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { setFarmsSearchQuery } from 'app/state/farms'
import { useAppDispatch } from 'app/state/hooks'
import { FC } from 'react'

export const FarmSearch: FC = () => {
  const { i18n } = useLingui()
  const dispatch = useAppDispatch()
  return (
    <div className="flex items-center flex-grow w-full gap-4 sm:w-auto">
      <div className="flex items-center flex-grow w-full gap-2 px-3 py-2 bg-opacity-50 border rounded border-dark-800 bg-dark-900 sm:w-auto">
        <SearchIcon strokeWidth={3} width={20} height={20} />
        <input
          className="w-full bg-transparent text-high-emphesis placeholder:text-low-emphesis"
          placeholder={i18n._(t`Search by token or farm`)}
          onChange={(e) => dispatch(setFarmsSearchQuery(e.target.value))}
        />
      </div>
    </div>
  )
}

export default FarmSearch
