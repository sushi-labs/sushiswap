import React, { FC } from 'react'
import dynamic from 'next/dynamic'

const SushiWalletConnector = dynamic(() => import('wallet-connector/components'), {
  ssr: false,
})

const Index: FC = () => {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold underline">Wallet example</h1>
      <SushiWalletConnector />
    </div>
  )
}

export default Index
