import { ChainId } from '@sushiswap/chain'
import { FuroStreamRouterChainId } from '@sushiswap/furo'
import { NextSeo } from 'next-seo'
import { useNetwork } from '@sushiswap/wagmi'

import { Layout } from '../../../components'
import { CreateMultipleForm } from '../../../components/stream/CreateMultipleForm'
import Link from 'next/link'
import { IconButton } from '@sushiswap/ui/future/components/iconbutton'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import React from 'react'

const MultipleStream = () => {
  const { chain } = useNetwork()
  const chainId = (chain?.id || ChainId.ETHEREUM) as FuroStreamRouterChainId

  return (
    <>
      <NextSeo title="New Streams" />
      <Layout maxWidth="7xl">
        <Link
          className="group flex gap-4 items-center mb-2"
          href={{
            pathname: '/create',
          }}
          shallow={true}
        >
          <IconButton
            icon={ArrowLeftIcon}
            iconProps={{
              width: 24,
              height: 24,
              transparent: true,
            }}
            name="Back"
          />
          <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">Go back</span>
        </Link>
        <CreateMultipleForm chainId={chainId} />
      </Layout>
    </>
  )
}

export default MultipleStream
