import { PortfolioSubHeader } from './wallet-holdings/portfolio-subheader'

export function PortfolioHeader() {
  return (
    <div className="flex flex-col gap-3 items-start md:justify-start">
      <span className="md:text-[32px] text-lg font-semibold">
        Portfolio Overview
      </span>
      <PortfolioSubHeader />
    </div>
  )
}
