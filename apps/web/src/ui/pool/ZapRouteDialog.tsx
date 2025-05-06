import {
  Currency,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@sushiswap/ui'
import { type FC, type ReactNode, useMemo } from 'react'
import { Token, type Type } from 'sushi/currency'
import { formatPercent } from 'sushi/format'
import { SushiSwapV2Pool } from 'sushi/pool'

interface ZapRouteDialogProps {
  children: ReactNode
  inputCurrency: Type
  pool: SushiSwapV2Pool
  tokenRatios?: { token0: number; token1: number }
}

export const ZapRouteDialog: FC<ZapRouteDialogProps> = ({
  children,
  inputCurrency,
  pool,
  tokenRatios,
}) => {
  const [token0, token1] = useMemo(
    () => [
      pool.token0 instanceof Token ? pool.token0 : new Token(pool.token0),
      pool.token1 instanceof Token ? pool.token1 : new Token(pool.token1),
    ],
    [pool],
  )

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Route</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted-foreground">Split & Swap</span>
          <div className="flex flex-col gap-1 bg-secondary rounded-xl">
            <div className="grid items-center grid-cols-3 gap-3 px-5 py-2">
              <div className="flex items-center gap-1">
                <Currency.Icon
                  disableLink
                  currency={inputCurrency}
                  width={16}
                  height={16}
                />
                <span className="text-sm font-semibold truncate">
                  {inputCurrency.symbol}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium truncate">
                  {pool instanceof SushiSwapV2Pool
                    ? '50%'
                    : tokenRatios
                      ? `${formatPercent(tokenRatios.token0)}`
                      : '-%'}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground truncate">
                  SushiSwap
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Currency.Icon
                  disableLink
                  currency={token0}
                  width={16}
                  height={16}
                />
                <span className="text-sm font-semibold truncate">
                  {token0.symbol}
                </span>
              </div>
            </div>
            <div className="grid items-center grid-cols-3 gap-3 px-5 py-2">
              <div className="flex items-center gap-1">
                <Currency.Icon
                  disableLink
                  currency={inputCurrency}
                  width={16}
                  height={16}
                />
                <span className="text-sm font-semibold truncate">
                  {inputCurrency.symbol}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium truncate">
                  {pool instanceof SushiSwapV2Pool
                    ? '50%'
                    : tokenRatios
                      ? `${formatPercent(tokenRatios.token1)}`
                      : '-%'}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground truncate">
                  SushiSwap
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <Currency.Icon
                  disableLink
                  currency={token1}
                  width={16}
                  height={16}
                />
                <span className="text-sm font-semibold truncate">
                  {token1.symbol}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted-foreground">Add Liquidity</span>
          <div className="flex flex-col gap-1 bg-secondary rounded-xl">
            <div className="grid items-center grid-cols-3 gap-3 px-5 py-2">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                  <Currency.Icon
                    disableLink
                    currency={token0}
                    width={16}
                    height={16}
                  />
                  <span className="text-sm font-semibold truncate">
                    {token0.symbol}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Currency.Icon
                    disableLink
                    currency={token1}
                    width={16}
                    height={16}
                  />
                  <span className="text-sm font-semibold truncate">
                    {token1.symbol}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium truncate">100%</div>
                <span className="text-[10px] font-medium text-muted-foreground truncate">
                  Deposit to SushiSwap V2
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="inline-flex items-center">
                  <Currency.Icon
                    disableLink
                    currency={token0}
                    width={16}
                    height={16}
                  />
                  <div className="inline-flex -ml-1">
                    <Currency.Icon
                      disableLink
                      currency={token1}
                      width={16}
                      height={16}
                    />
                  </div>
                </span>
                <span className="text-sm font-semibold truncate">SLP</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
