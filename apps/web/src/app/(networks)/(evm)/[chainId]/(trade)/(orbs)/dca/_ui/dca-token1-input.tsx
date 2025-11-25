'use client'

import {
  Button,
  Currency,
  SelectIcon,
  SkeletonBox,
  classNames,
} from '@sushiswap/ui'
import { useMemo } from 'react'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { BalancePanel } from 'src/lib/wagmi/components/web3-input/Currency/balance-panel'
import { useConnection } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useDerivedStateTwap } from '../../_ui/derivedstate-twap-provider'

export const DCAToken1Input = () => {
  const {
    state: { chainId, token1: token },
    mutate: { setToken1: onSelect },
    isToken1Loading: isTokenLoading,
  } = useDerivedStateTwap()

  const { address } = useConnection()

  const { data: balance, isLoading: isBalanceLoading } = useAmountBalance(token)

  const selector = useMemo(() => {
    return (
      <TokenSelector selected={token} chainId={chainId} onSelect={onSelect}>
        <Button
          data-state={isTokenLoading ? 'inactive' : 'active'}
          size="lg"
          variant={token ? 'secondary' : 'default'}
          id={'swap-to'}
          type="button"
          className={classNames(
            token ? 'pl-2 pr-3 text-xl' : '',
            '!rounded-full data-[state=inactive]:hidden data-[state=active]:flex',
          )}
        >
          {token ? (
            <>
              <div className="w-[28px] h-[28px] mr-0.5">
                <Currency.Icon
                  disableLink
                  currency={token}
                  width={28}
                  height={28}
                />
              </div>
              {token.symbol}
              <SelectIcon />
            </>
          ) : (
            'Select token'
          )}
        </Button>
      </TokenSelector>
    )
  }, [isTokenLoading, onSelect, token, chainId])

  return (
    <div
      className={
        'relative space-y-2 overflow-hidden border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl'
      }
    >
      <span className="text-sm text-muted-foreground">You're buying</span>
      <div className="flex justify-between items-end gap-4">
        {isTokenLoading ? (
          <div className="flex items-center h-[44px] w-full">
            <SkeletonBox className="w-32 h-8 rounded-lg" />
          </div>
        ) : null}
        {selector}
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
    </div>
  )
}
