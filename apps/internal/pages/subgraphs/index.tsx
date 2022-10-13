import { CHAIN_NAME } from '@sushiswap/graph-config'
import { useDebounce } from '@sushiswap/hooks'
import Checkbox from '@sushiswap/ui/checkbox/Checkbox'
import { SubgraphTable } from 'components/subgraphs/SubgraphTable'
import { getSubgraphs, Subgraph } from 'lib'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

export const getServerSideProps: GetServerSideProps<{ fallback: { [key: string]: Subgraph[] } }> = async ({
  req,
  res,
}) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')

  const data = await getSubgraphs()
  return {
    props: {
      fallback: {
        ['subgraphs?filter=']: data,
      },
    },
  }
}

const SubgraphsPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <_SubgraphsPage />
    </SWRConfig>
  )
}

const _SubgraphsPage = () => {
  const [filterBy, setFilter] = useState<string>('')
  const debouncedFilterBy = useDebounce(filterBy, 400)
  const [groupBy, setGroupBy] = useState<keyof Subgraph>('category')
  const [blocks, setBlocks] = useState<{ title: string; subgraphs: Subgraph[] }[]>([])

  const { data } = useSWR<Subgraph[]>(`subgraphs?filter=${debouncedFilterBy}`, () =>
    getSubgraphs({ filter: debouncedFilterBy })
  )

  const subgraphs = useMemo(() => data || [], [data])

  useMemo(() => {
    const groups = (subgraphs ?? [])
      .map((subgraph) => subgraph[groupBy])
      .filter((value, index, self) => self.indexOf(value) === index) // remove duplicates

    setBlocks(
      groups.map((group) => ({
        title: String(groupBy === 'chainId' ? CHAIN_NAME[group as number] : group),
        subgraphs: subgraphs.filter((subgraph) => subgraph[groupBy] === group),
      }))
    )
  }, [subgraphs, groupBy])

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-7xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <div>Filters and other things</div>
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col justify-center p-4 space-y-4 text-sm bg-slate-800 bg-opacity-70 rounded-xl w-fit">
                <div>Group by</div>
                <div className="h-px -m-4 bg-slate-700 w-parent" />
                <div className="inline-grid grid-cols-2 gap-2 min-con">
                  {(['chainId', 'category', 'type', 'status'] as const).map((group) => (
                    <>
                      <div>{group}</div>
                      <Checkbox set={() => setGroupBy(group)} checked={groupBy === group} />
                    </>
                  ))}
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
              <div></div>
            </div>
          </div>
          <div className="space-y-6">
            {blocks.map((block) => (
              <div key={block.title} className="space-y-2">
                <div>{block.title}</div>
                <SubgraphTable subgraphs={block.subgraphs} groupBy={groupBy} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubgraphsPage
