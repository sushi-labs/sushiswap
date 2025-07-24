import {
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  CardTitle,
  Currency,
} from '@sushiswap/ui'
import { Native } from 'sushi/currency'
import { Wrapper } from '../swap/trade/wrapper'

export const PoolAPR = () => {
  return (
    <Wrapper enableBorder className="!p-3">
      <CardHeader className="!p-0 !pb-5 flex justify-between items-center !flex-row md:flex-col gap-1">
        <CardTitle className="text-slate-900 dark:text-slate-100">
          Total APR
        </CardTitle>
        <CardDescription className="!mt-0 font-bold md:font-medium text-sm md:!text-2xl flex items-center">
          11.5%
        </CardDescription>
      </CardHeader>
      <CardContent className="!p-0">
        <CardGroup className="!gap-3 md:!gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-medium text-slate-900 dark:text-slate-100">
              <span>Fee APR (Full Range)</span>
              <span>11.5%</span>
            </div>
            <span className="hidden text-sm md:block text-slate-450 dark:text-slate-500">
              Liquidity Pool fees from swap transactions
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-sm font-medium text-slate-900 dark:text-slate-100">
              <span className="flex gap-2 items-center">
                Rewards APR{' '}
                <Currency.Icon
                  currency={Native.onChain(1)}
                  width={14}
                  height={14}
                />
              </span>
              <span>2.5%</span>
            </div>
            <span className="hidden text-sm md:block text-slate-450 dark:text-slate-500">
              Boosted rewards{' '}
            </span>
          </div>
        </CardGroup>
      </CardContent>
    </Wrapper>
  )
}
