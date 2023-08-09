import { Button } from '@sushiswap/ui/future/components/button'
import { FC, useState } from 'react'
import { Search } from '../../../../../components/Search'
import { Tab } from '@headlessui/react'

export const PoolFilters: FC<{ showCategories: boolean }> = ({ showCategories = true }) => {
  const [query, setQuery] = useState<string>()

  const isLoading = Boolean(query !== '' && query && query?.length > 2)
  return (
    <>
      <Tab.Group>
        <Tab.Panels>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex gap-4">
              <Search id="search" loading={isLoading} onChange={setQuery} value={query ?? ''} />
              {/* <div className="!focus-within:bg-gray-200 relative pr-10 rounded-xl flex gap-2.5 flex-grow items-center bg-black/[0.04] dark:bg-white/[0.04] px-3 py-2.5 h-[44px]">
                  <Typography variant="sm" weight={600} className="px-4 text-neutral-400">
                    Networks
                  </Typography>
                </div> */}
            </div>
            {showCategories && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-3 flex-wrap items-center">
                  <Button className="gap-2.5" size="sm" variant="outlined" color="default">
                    <span>🍣</span>{' '}
                    <span>
                      SushiSwap <sup>v2</sup>
                    </span>
                  </Button>
                  <Button size="sm" variant="outlined" color="default" className="flex gap-2.5">
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
