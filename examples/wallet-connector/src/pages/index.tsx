import React, { FC } from 'react'

// import dynamic from 'next/dynamic'
// const Connect = dynamic(() => import('@sushiswap/wallet-connector/components/Connect'), { ssr: false })

import { Connect } from '@sushiswap/wallet-connector'

const Index: FC = () => {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold underline">Wallet example</h1>
      <Connect />
    </div>
  )
}

export default Index
