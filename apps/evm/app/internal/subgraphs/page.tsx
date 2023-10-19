'use client'

import { CHAIN_NAME } from '@sushiswap/graph-config'
import { useDebounce } from '@sushiswap/hooks'
import { Checkbox } from '@sushiswap/ui/components/checkbox'
import { Loader } from '@sushiswap/ui/components/loader'
import stringify from 'fast-json-stable-stringify'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import { SubgraphTable } from './components/SubgraphTable'
import { Subgraph, getSubgraphs } from './lib'

const SubgraphsPage = () => {
  const [filterBy, setFilter] = useState<string>('')
  const debouncedFilterBy = useDebounce(filterBy, 400)
  const [groupBy, setGroupBy] = useState<keyof Subgraph>('category')
  const [blocks, setBlocks] = useState<
    { title: string; subgraphs: Subgraph[] }[]
  >([])

  const { data, isValidating } = useSWR(
    stringify(['subgraphs', debouncedFilterBy]),
    () => getSubgraphs({ filter: debouncedFilterBy }),
  )

  // console.log(data, error)

  const subgraphs = useMemo(() => data || [], [data])

  useMemo(() => {
    const groups = (subgraphs ?? [])
      .map((subgraph) => subgraph[groupBy])
      .filter((value, index, self) => self.indexOf(value) === index) // remove duplicates

    setBlocks(
      groups.map((group) => ({
        title: String(
          groupBy === 'chainId' ? CHAIN_NAME[group as number] : group,
        ),
        subgraphs: subgraphs.filter((subgraph) => subgraph[groupBy] === group),
      })),
    )
  }, [subgraphs, groupBy])

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="w-full max-w-7xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <div>Filters and other things</div>
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col justify-center p-4 space-y-4 text-sm bg-slate-800 bg-opacity-70 rounded-xl w-fit">
                <div>Group by</div>
                <div className="h-px -m-4 bg-slate-700 w-parent" />
                <div className="inline-grid grid-cols-2 gap-2 min-con">
                  {(['chainId', 'category', 'type', 'status'] as const).map(
                    (group) => (
                      <>
                        <div>{group}</div>
                        <Checkbox
                          onCheckedChange={() => setGroupBy(group)}
                          checked={groupBy === group}
                        />
                      </>
                    ),
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center p-4 space-y-4 text-sm bg-slate-800 bg-opacity-70 rounded-xl w-fit h-fit">
                <div>Search by</div>
                <input
                  className="p-3 rounded-xl bg-slate-800"
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Name"
                />
              </div>
              <div />
            </div>
          </div>
          <div className="flex flex-col items-center w-full space-y-6">
            {blocks.map((block) => (
              <div key={block.title} className="space-y-2">
                <SubgraphTable
                  subgraphs={block.subgraphs}
                  groupBy={groupBy}
                  title={block.title}
                />
              </div>
            ))}
            {!data && !isValidating && (
              <div className="">
                Error loading data. Probably 429d. Wait a bit and refresh.
              </div>
            )}
            {!data && isValidating && (
              <div className="p-2 bg-slate-800 rounded-xl w-min">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubgraphsPage
