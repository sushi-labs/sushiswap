import { useMemo } from 'react'
import type { SushiSwapProtocol } from 'sushi'

export const DoesNotExistMessage = ({
  type,
}: { type: SushiSwapProtocol | 'BLADE' }) => {
  const message = useMemo(() => {
    if (type === 'SUSHISWAP_V2') {
      return 'This pool does not exist yet. To initialize, enter your deposit amounts. Gas fees will be higher than usual due to the initialization transaction.'
    }
    if (type === 'SUSHISWAP_V3') {
      return 'This pool does not exist yet. It must be initialized before you can add liquidity. To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. Gas fees will be higher than usual due to the initialization transaction.'
    }
    if (type === 'BLADE') {
      return 'This pool does not exist yet. To initialize, enter your deposit amounts. Gas fees will be higher than usual due to the initialization transaction.'
    }
  }, [type])

  return (
    <div className="w-full p-3 bg-blue/[0.08] dark:bg-[#FFFFFF14] rounded-xl">
      <p className="text-sm text-blue dark:text-white font-medium">{message}</p>
    </div>
  )
}
