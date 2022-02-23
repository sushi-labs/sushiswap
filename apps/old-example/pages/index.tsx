import dynamic from 'next/dynamic'
import { FC } from 'react'

const Account = dynamic(() => import('../components/account'), { ssr: false })
const ConnectWalletView = dynamic(() => import('../components/connect/ConnectWalletView'), { ssr: false })

const Index: FC = () => {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Account />
      <ConnectWalletView />
    </div>
  )
}

export default Index
