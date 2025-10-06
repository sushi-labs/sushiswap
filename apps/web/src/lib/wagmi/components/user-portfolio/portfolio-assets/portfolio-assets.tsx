import { Button } from '@sushiswap/ui'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useTotalBalance } from '../hooks/use-total-balance'
import { ClaimableAssets } from './claimable-assets'
import { PositionAssets } from './position-assets'
import { TotalBalance } from './total-balance'
import { WalletAssets } from './wallet-assets'

export type PortfolioAccordionValue =
  | 'wallet'
  | 'lps'
  | 'claimables'
  | (string & {})

export type PortfolioAssetsProps = {
  value: PortfolioAccordionValue
  onValueChange: (value: PortfolioAccordionValue) => void
}

export const PortfolioAssets = () => {
  const [value, setValue] = useState<PortfolioAccordionValue>('wallet')
  const { address } = useAccount()
  const { data, isLoading } = useTotalBalance({ address })

  const totalUSD = data?.totalUSD ?? 0

  const handleValueChange = (value: PortfolioAccordionValue) => {
    setValue(value)
  }

  return (
    <div className="flex flex-col gap-y-2 pb-4 h-full overflow-y-auto hide-scrollbar">
      <div className="px-5">
        <TotalBalance />
      </div>
      {totalUSD === 0 && !isLoading ? (
        <Button
          variant="secondary"
          className="mx-4"
          onClick={() => alert('TODO: get link to buy crypto')}
        >
          Buy Crypto
        </Button>
      ) : (
        <div className="flex flex-col gap-y-2 px-4">
          <WalletAssets value={value} onValueChange={handleValueChange} />
          <PositionAssets value={value} onValueChange={handleValueChange} />
          <ClaimableAssets value={value} onValueChange={handleValueChange} />
        </div>
      )}
    </div>
  )
}
