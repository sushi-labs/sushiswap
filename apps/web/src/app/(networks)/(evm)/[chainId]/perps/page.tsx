import { classNames } from '@sushiswap/ui'

export default function PerpsPage() {
  //use Activity comp from react to save state on renders and use breakpoint hook to conditionally render layouts
  return (
    <>
      <div className="h-[calc(100vh-98px)] w-full block lg:hidden">
        <div className="flex flex-col gap-1 pt-2 h-full">
          <TokenSelector />
          <div className="bg-blue-500/50 border p-2 h-[500px] min-h-[450px]">
            chart/orderbook/trades tabs
          </div>

          <TradeHistory className="min-h-[300px] h-full" />
        </div>
        <div className="fixed bottom-0 w-full left-0 py-2 border bg-purple-500/50">
          footer nav
        </div>
      </div>
      <DesktopLayout />
    </>
  )
}
const DesktopLayout = () => (
  <div className="h-[calc(100vh-56px)] w-full hidden lg:block">
    <div className="flex gap-1">
      <div className="flex flex-col w-full gap-1">
        <div className="flex gap-1 w-full">
          <div className="flex flex-col gap-1 w-full">
            <div className="bg-blue-500/50 border p-2">favorites</div>
            <TokenSelector />
            <Chart className="min-h-[675px]" />
          </div>
          <div className=" hidden xl:block min-w-[300px] xl:w-[29.074%]">
            <Orderbook className="h-full" />
          </div>
        </div>
        <div className="min-h-[450px]">
          <TradeHistory className="h-full" />
        </div>
      </div>

      <div className="flex flex-col gap-1 w-[40%] xl:w-[22.5%]">
        <div className="flex flex-col xl:flex-row w-full gap-1 xl:min-w-[280px]">
          <div className="w-full min-h-[783px] block xl:hidden">
            <Orderbook className="h-full" />
          </div>

          <div className="w-full min-h-[783px]">
            <BuySell className="h-full" />
          </div>
        </div>
        <div className="min-h-[675px]">
          <DepositWithdrawals className="h-full" />
        </div>
      </div>
    </div>
  </div>
)

const DepositWithdrawals = ({ className }: { className?: string }) => (
  <div className={classNames('bg-green-500/50 border', className ?? '')}>
    Deposits and withdrawals/ account details
  </div>
)

const TokenSelector = () => (
  <div className="bg-green-500/50 border p-4">token selector/stats</div>
)
const Orderbook = ({ className }: { className?: string }) => (
  <div className={classNames('bg-yellow-500/50 border', className ?? '')}>
    orderbook/trades
  </div>
)

const Chart = ({ className }: { className?: string }) => (
  <div className={classNames('bg-red-500/50 border', className ?? '')}>
    chart
  </div>
)
const TradeHistory = ({ className }: { className?: string }) => (
  <div className={classNames('bg-teal-500/50 border ', className ?? '')}>
    trades/trade history
  </div>
)
const BuySell = ({ className }: { className?: string }) => (
  <div className={classNames('bg-orange-500/50 border ', className ?? '')}>
    settings/buy/sell
  </div>
)
