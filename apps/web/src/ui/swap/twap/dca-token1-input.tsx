'use client'

import {
  Badge,
  Button,
  Currency,
  SelectIcon,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useMemo } from 'react'
import { useTradeMode } from 'src/lib/hooks/useTradeMode'
import { QuickSelect } from 'src/lib/wagmi/components/token-selector/quick-select/quick-select'
import { TokenSelectorV2 } from 'src/lib/wagmi/components/token-selector/token-selector-v2'
import { BalancePanel } from 'src/lib/wagmi/components/web3-input/Currency/BalancePanel'
import { useAccount } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

export const DCAToken1Input = () => {
  const {
    state: { chainId, token1: token },
    mutate: { setToken1: onSelect },
    isToken1Loading: isTokenLoading,
  } = useDerivedStateTwap()
  const { tradeMode } = useTradeMode()
  const isTwap = tradeMode === 'limit' || tradeMode === 'dca'

  const { address } = useAccount()

  const { data: balance, isLoading: isBalanceLoading } = useAmountBalance(token)

  const selector = useMemo(() => {
    return (
      <TokenSelectorV2
        type="buy"
        selected={token}
        chainId={chainId}
        onSelect={onSelect}
        isTwap={isTwap}
      >
        <Button
          data-state={isTokenLoading ? 'inactive' : 'active'}
          size="lg"
          variant={token ? 'secondary' : 'default'}
          id={'swap-to'}
          type="button"
          className={classNames(
            token ? 'pl-2 pr-3 text-xl' : '',
            '!rounded-full data-[state=inactive]:hidden data-[state=active]:flex bg-slate-200 dark:bg-slate-750',
          )}
        >
          {token ? (
            <>
              <div className="w-[28px] h-[28px] mr-0.5">
                <Badge
                  className="dark:border-[#222137] border-[#F5F5F5] border rounded-[4px] z-[11]"
                  position="bottom-right"
                  badgeContent={
                    <NetworkIcon
                      type="square"
                      className="rounded-[3px]"
                      chainId={token.chainId}
                      width={14}
                      height={14}
                    />
                  }
                >
                  <Currency.Icon
                    disableLink
                    currency={token}
                    width={28}
                    height={28}
                  />
                </Badge>
              </div>
              {token.symbol}
              <SelectIcon />
            </>
          ) : (
            'Select token'
          )}
        </Button>
      </TokenSelectorV2>
    )
  }, [isTokenLoading, onSelect, token, chainId, isTwap])

  return (
    <div
      className={
        'relative space-y-4 border border-white/10 dark:border-black/10 p-3 bg-gray-100 dark:bg-slate-900 rounded-xl'
      }
    >
      <div className="flex justify-between items-end gap-4">
        <span className="text-sm text-muted-foreground">Buy</span>
        <BalancePanel
          id={'swap-to'}
          loading={isBalanceLoading}
          chainId={chainId}
          account={address}
          currency={token}
          disableMaxButton={true}
          balance={balance}
          type={'OUTPUT'}
        />
      </div>
      <div className="flex justify-end items-center gap-4">
        <QuickSelect />
        {selector}
        {isTokenLoading ? (
          <div className="flex items-center h-[44px] w-full">
            <SkeletonBox className="w-32 h-8 rounded-lg" />
          </div>
        ) : null}
      </div>
    </div>
  )
}
