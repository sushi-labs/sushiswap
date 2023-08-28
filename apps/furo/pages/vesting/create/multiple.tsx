import { ArrowLeftIcon } from '@heroicons/react/solid'
import { ChainId } from '@sushiswap/chain'
import { FuroChainId } from '@sushiswap/furo-sdk'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { useNetwork } from '@sushiswap/wagmi'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import React from 'react'

import { Layout } from '../../../components'
import { CreateMultipleForm } from '../../../components/vesting/CreateMultipleForm'

const MultipleStream = () => {
  const { chain } = useNetwork()
  const chainId = (chain?.id || ChainId.ETHEREUM) as FuroChainId

  return (
    <>
      <NextSeo title="New Vests" />
      <Layout maxWidth="7xl">
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
        <CreateMultipleForm chainId={chainId} />
      </Layout>
    </>
  )
}

export default MultipleStream
