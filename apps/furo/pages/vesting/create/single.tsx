import { ArrowLeftIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { FuroVestingRouterChainId } from '@sushiswap/furo'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { useNetwork } from '@sushiswap/wagmi'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import React from 'react'

import { Layout } from '../../../components'
import { CreateForm } from '../../../components/vesting'

const SingleVesting = () => {
  const { chain } = useNetwork()
  const chainId = (chain?.id || ChainId.ETHEREUM) as FuroVestingRouterChainId

  return (
    <>
      <NextSeo title="New Vesting" />
      <Layout>
        <Link
          className="group flex gap-4 items-center mb-2"
          href={{
            pathname: '/create',
          }}
          shallow={true}
        >
          <IconButton size="sm" icon={ArrowLeftIcon} name="Back" />
          <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">Go back</span>
        </Link>
        <CreateForm chainId={chainId} />
      </Layout>
    </>
  )
}

export default SingleVesting
