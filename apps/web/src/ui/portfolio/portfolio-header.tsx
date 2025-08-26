import { PortfolioSubHeader } from './wallet-holdings/portfolio-subheader'

export function PortfolioHeader() {
  return (
    <div className="flex flex-col items-start md:gap-3 md:justify-start">
      <span className="md:text-[32px] text-lg font-semibold">
        Portfolio Overview
      </span>
      <PortfolioSubHeader />
    </div>
  )
}
