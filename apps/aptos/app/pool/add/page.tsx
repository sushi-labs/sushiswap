'use client'
import Container from '@sushiswap/ui/future/components/Container'
import Link from 'next/link'
import React, { FC, useEffect } from 'react'
import { Add } from '../Pool/PoolPage'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import requiredNetworkAlert from 'utils/requiredNetworkAlert'

export default function AddPage() {
  const { network, disconnect } = useWallet()
  useEffect(() => {
    requiredNetworkAlert(network, disconnect)
  }, [network])
  return (
    <>
      <Container maxWidth={'5xl'} className="flex justify-center lg:mx-auto px-4 h-full">
        <div className="pb-4 mt-10 mb-4 lg:mb-40 xl:mt-20">
          <div className="flex flex-col gap-2">
            <Link className="group flex gap-4 items-center mb-2" href="/" shallow={true}></Link>
          </div>
          <div className="grid grid-cols-1 sm:w-[340px] md:w-[572px] gap-10">
            <div className="hidden md:block"></div>
            <_Add />
          </div>
        </div>
      </Container>
    </>
  )
}

const _Add: FC = () => {
  return (
    <>
      <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
        <Add />
      </div>
    </>
  )
}
