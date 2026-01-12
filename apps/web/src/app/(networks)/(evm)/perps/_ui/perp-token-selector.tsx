import { Card } from '@sushiswap/ui'
import { useAssetList } from 'src/lib/perps/use-asset-list'
import { TokenStats } from './token-stats/token-stats'

export const PerpTokenSelector = () => {
  const { data } = useAssetList()
  //todo: provider for selected token
  // const token = data?.perp?.get?.('BTC-USDC')
  const token = data?.spot?.get?.('HYPE/USDC')
  return (
    <Card className="p-4 gap-8 flex items-center">
      <div className="whitespace-nowrap">
        {token?.symbol} {token?.maxLeverage ? `${token.maxLeverage}x` : 'Spot'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="grid grid-flow-col auto-cols-max gap-8">
            <TokenStats />
          </div>
        </div>
      </div>
    </Card>
  )
}
