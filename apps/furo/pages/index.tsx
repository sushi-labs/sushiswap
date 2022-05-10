import { Wallet } from '@sushiswap/wallet-connector'

export default function Index() {
  return (
    <div className="h-full">
      <h1 className="py-4 text-2xl font-bold">Overview</h1>
      <div className="flex space-x-4">
        <Wallet.Button />
      </div>
    </div>
  )
}
