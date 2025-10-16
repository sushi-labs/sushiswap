import { Badge, classNames } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui'
import { Currency } from '@sushiswap/ui'
import { SelectIcon } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import React, { type FC } from 'react'
import { TokenSelectorV2 } from 'src/lib/wagmi/components/token-selector/token-selector-v2'
import type { EvmChainId } from 'sushi/evm'
import type { EvmCurrency } from 'sushi/evm'

interface SelectTokensWidgetV2 {
  chainId: EvmChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  setToken0(token: EvmCurrency): void
  setToken1(token: EvmCurrency): void
  title?: string
  includeNative?: boolean
}

export const SelectTokensWidgetV2: FC<SelectTokensWidgetV2> = ({
  chainId,
  token0,
  token1,
  setToken0,
  setToken1,
  includeNative,
}) => {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col w-full gap-1.5">
        <p className="font-medium text-slate-900 md:text-slate-450 dark:text-pink-100 md:dark:text-slate-500 text-sm">
          Token
        </p>
        <TokenSelectorV2
          selected={token0}
          onSelect={setToken0}
          includeNative={includeNative}
          selectedNetwork={chainId}
          type="sell"
        >
          <Button
            variant="secondary"
            id={'token0-select-button'}
            testId={'token0-select'}
            className={classNames(
              'px-4 h-[48px] w-full data-[state=inactive]:hidden !justify-between  data-[state=active]:flex bg-slate-200 dark:bg-slate-750',
            )}
          >
            {token0 ? (
              <div className="flex items-center gap-2">
                <div className="w-[37px] h-[37px] mr-0.5">
                  <Badge
                    className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] z-[11] !-right-[15%] bottom-[3%]"
                    position="bottom-right"
                    badgeContent={
                      <NetworkIcon
                        type="square"
                        className="rounded-[3px]"
                        chainId={token0.chainId}
                        width={15}
                        height={15}
                      />
                    }
                  >
                    <Currency.Icon
                      disableLink
                      currency={token0}
                      width={37}
                      height={37}
                    />
                  </Badge>
                </div>
                <span className="text-[16px] font-medium">{token0.symbol}</span>
              </div>
            ) : (
              'Select Token'
            )}
            <SelectIcon />
          </Button>
        </TokenSelectorV2>
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <p className="font-medium text-slate-900 md:text-slate-450 dark:text-pink-100 md:dark:text-slate-500 text-sm">
          Token
        </p>
        <TokenSelectorV2
          selected={token1}
          onSelect={setToken1}
          includeNative={includeNative}
          selectedNetwork={chainId}
          type="sell"
        >
          <Button
            variant="secondary"
            color={!token1 ? 'blue' : 'default'}
            id={'token1-select-button'}
            testId={'token1-select'}
            className={classNames(
              'px-4 h-[48px] w-full data-[state=inactive]:hidden !justify-between  data-[state=active]:flex bg-slate-200 dark:bg-slate-750',
            )}
          >
            {token1 ? (
              <div className="flex items-center gap-2">
                <div className="w-[37px] h-[37px] mr-0.5">
                  <Badge
                    className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] z-[11] !-right-[15%] bottom-[3%]"
                    position="bottom-right"
                    badgeContent={
                      <NetworkIcon
                        type="square"
                        className="rounded-[3px]"
                        chainId={token1.chainId}
                        width={15}
                        height={15}
                      />
                    }
                  >
                    <Currency.Icon
                      disableLink
                      currency={token1}
                      width={37}
                      height={37}
                    />
                  </Badge>
                </div>
                <span className="text-[16px] font-medium">{token1.symbol}</span>
              </div>
            ) : (
              'Select Token'
            )}
            <SelectIcon />
          </Button>
        </TokenSelectorV2>
      </div>
    </div>
  )
}
