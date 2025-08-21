import { Switch } from '@sushiswap/ui'
import { SendWidget } from './send-widget'

export const WalletHoldingsHeader = () => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <span className="font-semibold">Wallet: $32,123.23</span>
        <SendWidget />
      </div>
      <div className="flex gap-5">
        <div className="flex gap-2 items-center">
          <span className="text-[#535263] dark:!bg-slate-900">
            Hide &lt; $1
          </span>
          <Switch />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-[#535263] dark:!bg-slate-900">
            Group By Assets
          </span>
          <Switch />
        </div>{' '}
      </div>
    </>
  )
}
