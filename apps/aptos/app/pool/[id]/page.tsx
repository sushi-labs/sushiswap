'use client'
import { AppearOnMount } from '@sushiswap/ui'
import { Layout } from 'components/Layout'
import { PoolButtons } from 'components/PoolSection/PoolButtons'
import { PoolComposition } from 'components/PoolSection/PoolComposition'
import { PoolHeader } from 'components/PoolSection/PoolHeader'
import { PoolPosition } from 'components/PoolSection/PoolPosition/PoolPosition'
import { useParams } from 'next/navigation'
import { FC } from 'react'
import { Pool } from 'utils/usePools'

const LINKS = (row: Pool) => [
  {
    href: `/${row.id}`,
    label: ``,
  },
]

const Pool: FC = ({}) => {
  return <_Pool />
}

const _Pool = () => {
  const router = useParams()
  console.log(router)
  return (
    <>
      <Layout>
        <div className="flex flex-col gap-9">
          <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
            <div className="flex flex-col order-1 gap-9">
              <PoolHeader row={row} />
              <hr className="my-3 border-t border-gray-900/5 dark:border-slate-200/5" />
              <PoolComposition row={row} />
            </div>
            <div className="flex flex-col order-2 gap-4">
              <AppearOnMount>
                <div className="flex flex-col gap-10">
                  <PoolPosition row={row} />
                </div>
              </AppearOnMount>
              <div className="hidden lg:flex">
                <PoolButtons />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Pool
