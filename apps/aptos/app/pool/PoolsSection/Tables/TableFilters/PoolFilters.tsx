import { Button } from '@sushiswap/ui/future/components/button'
import { FC, useState } from 'react'
import { Search } from '../../../../../components/Search'
import { Tab } from '@headlessui/react'
import { useDebounce } from '@sushiswap/hooks'

interface Props {
  showCategories: boolean
  farmHandler: () => void
  farmsOnly: boolean
}

export const PoolFilters: FC<Props> = ({ showCategories = true, farmHandler, farmsOnly }) => {
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 400)

  return (
    <>
      <Tab.Group>
        <Tab.Panels>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4">
              <Search id="search" loading={false} onChange={setQuery} value={query ?? ''} delimiter=" " />
            </div>
            {showCategories && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-3 flex-wrap items-center">
                  <Button
                    onClick={farmHandler}
                    size="sm"
                    variant="outlined"
                    color={farmsOnly ? 'blue' : 'default'}
                    className="flex gap-2.5"
                  >
                    <span>🧑‍🌾</span> <span>Farms</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}
