'use client'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { AppearOnMount } from '@sushiswap/ui'
import { Layout } from 'components/Layout'
import { PoolButtons } from 'components/PoolSection/PoolButtons'
import { PoolComposition } from 'components/PoolSection/PoolComposition'
import { PoolHeader } from 'components/PoolSection/PoolHeader'
import { PoolPosition } from 'components/PoolSection/PoolPosition/PoolPosition'
import { useParams } from 'next/navigation'
import { FC } from 'react'
import { usePool } from 'utils/usePool'

const LINKS = () => [
  {
    href: ``,
  },
]

const Pool: FC = ({}) => {
  return <_Pool />
}

const _Pool = () => {
  const router = useParams()
  const [chainId, ...address] = decodeURIComponent(router?.id).split(':')
  const tokenAddress = address.join(':')
  const { network } = useWallet()
  const { data: pool } = usePool(network?.name.toLowerCase(), tokenAddress)
  console.log(pool)
  return (
    <>
      <Layout>
        <div className="flex flex-col gap-9">
          <div className="flex flex-col lg:grid lg:grid-cols-[568px_auto] gap-12">
            <div className="flex flex-col order-1 gap-9">
              <PoolHeader />
              <hr className="my-3 border-t border-gray-900/5 dark:border-slate-200/5" />
              <PoolComposition />
            </div>
            <div className="flex flex-col order-2 gap-4">
              <AppearOnMount>
                <div className="flex flex-col gap-10">
                  <PoolPosition />
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
