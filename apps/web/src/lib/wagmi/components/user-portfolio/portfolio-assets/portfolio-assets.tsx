import { TotalBalance } from './total-balance'

export const PortfolioAssets = () => {
  return (
    <div className="flex flex-col gap-y-5 h-full overflow-hidden">
      <div className="px-5">
        <TotalBalance />
      </div>
    </div>
  )
}
