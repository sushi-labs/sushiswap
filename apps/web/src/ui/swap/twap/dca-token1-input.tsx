'use client'

import { Button, Currency, SelectIcon, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { TokenSelector } from 'src/lib/wagmi/components/token-selector/token-selector'
import { BalancePanel } from 'src/lib/wagmi/components/web3-input/Currency/BalancePanel'
import { useAccount } from 'wagmi'
import { useAmountBalance } from '~evm/_common/ui/balance-provider/use-balance'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

export const DcaToken1Input = () => {
  const {
    state: { chainId, token1: token },
    mutate: { setToken1: onSelect },
    isToken1Loading: tokenLoading,
  } = useDerivedStateTwap()

  const { address } = useAccount()

  const { data: balance, isLoading: isBalanceLoading } = useAmountBalance(token)

  const selector = useMemo(() => {
    if (!onSelect) return null

    return (
      <TokenSelector selected={token} chainId={chainId} onSelect={onSelect}>
        <Button
          data-state={tokenLoading ? 'inactive' : 'active'}
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
  }, [tokenLoading, onSelect, token, chainId])

  return (
    <div
      className={
        'relative space-y-2 overflow-hidden border border-accent p-3 bg-white dark:bg-slate-800 rounded-xl'
      }
    >
      <span className="text-sm text-muted-foreground">You're buying</span>
      <div className="relative flex justify-between items-end gap-4">
        {/* <div
          data-state={isLoading ? 'active' : 'inactive'}
          className={classNames(
            'data-[state=inactive]:hidden data-[state=active]:flex',
            'gap-4 items-center justify-between flex-grow h-[44px]',
          )}
        >
          <SkeletonBox className="w-2/3 h-[32px] rounded-lg" />
          {currencyLoading ? (
            <SkeletonBox className="w-1/3 h-[32px] rounded-lg" />
          ) : null}
        </div>
        <div
          data-state={isLoading ? 'inactive' : 'active'}
          className="data-[state=inactive]:hidden data-[state=active]:flex flex-1 items-center"
        >
          <TextField
            testdata-id={`${id}-input`}
            type="number"
            variant="naked"
            disabled={disabled}
            onValueChange={_onChange}
            value={pending ? localValue : value}
            readOnly={disabled}
            maxDecimals={currency?.decimals}
            data-state={isLoading ? 'inactive' : 'active'}
            className={classNames('p-0 py-1 !text-3xl font-medium')}
          />
        </div> */}

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
        {/* {!onSelect ? (
          <div
            id={`swap-to-button`}
            className={classNames(
              'flex items-center gap-1 text-xl py-2 pl-2 pr-2 rounded-full font-medium whitespace-nowrap',
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
              </>
            ) : (
              <span className="text-gray-400 dark:text-slate-500">
                No token selected
              </span>
            )}
          </div>
        ) : null} */}
      </div>
    </div>
  )
}
