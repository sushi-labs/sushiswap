'use client'

import { AddressZero } from '@ethersproject/constants'
import { ChainId, chains } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { useAddCustomToken } from '@sushiswap/react-query'
import { useTokens } from '@sushiswap/react-query'
import { SlideIn } from '@sushiswap/ui13/components/animation'
import { Currency } from '@sushiswap/ui13/components/currency'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { Input } from '@sushiswap/ui13/components/input'
import { Search } from '@sushiswap/ui13/components/input/Search'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { useBalances, usePrices } from '../../hooks'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { TokenSelectorListFilterByQuery } from './TokenSelectorListFilterByQuery'
import { TokenSelectorRow } from './TokenSelectorRow'
import { TokenSelectorSettingsOverlay } from './TokenSelectorSettingsOverlay'

interface TokenSelectorProps {
  id: string
  selected: Type | undefined
  chainId: ChainId
  onSelect(currency: Type): void
  children({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
  fundSource?: FundSource
}

export const TokenSelector: FC<TokenSelectorProps> = ({
  id,
  selected,
  onSelect,
  chainId,
  children,
  fundSource = FundSource.WALLET,
}) => {
  const { address } = useAccount()
  const { mutate: onAddCustomToken } = useAddCustomToken()

  const [open, setOpen] = useState(false)
  const handleClose = useCallback(() => setOpen(false), [])

  const { data: tokenMap, isSuccess } = useTokens({ chainId })
  const { data: pricesMap } = usePrices({ chainId })

  // TODO SLOW, CHANGE CURRENCIES TO TOKENVALUES TO TEST
  const tokenValues = useMemo(() => (tokenMap ? Object.values(tokenMap) : []), [tokenMap])
  const { data: balancesMap } = useBalances({
    account: address,
    chainId,
    currencies: [],
    loadBentobox: false,
    enabled: open && isSuccess,
  })

  const _onSelect = useCallback(
    (currency: Token) => {
      onSelect && onSelect(currency)
      setOpen(false)
    },
    [onSelect]
  )

  const handleImport = useCallback(
    (currency: Token) => {
      onAddCustomToken(currency)
      _onSelect(currency)
    },
    [_onSelect, onAddCustomToken]
  )

  return (
    <>
      {children({ open, setOpen })}
      <TokenSelectorListFilterByQuery
        tokenMap={tokenMap}
        pricesMap={pricesMap}
        balancesMap={balancesMap}
        fundSource={fundSource}
        chainId={chainId}
      >
        {({ currencies, query, onInput, searching, queryToken }) => (
          <Dialog open={open} unmount={false} onClose={handleClose}>
            <Dialog.Content className="!max-w-md overflow-hidden h-[75vh] sm:h-[640px] !pt-4 !pb-4 rounded-2xl">
              <SlideIn>
                <div className="flex gap-2 items-center">
                  <Search id={id} input={Input.Address} value={query} loading={searching} onChange={onInput} />
                  <TokenSelectorSettingsOverlay />
                </div>

                <div className="flex flex-col gap-6 relative h-full mt-3">
                  <div className="relative h-[calc(100%-32px)] pt-5">
                    <div className="absolute inset-0 h-full rounded-t-none rounded-xl">
                      {queryToken[0] && (
                        <TokenSelectorImportRow
                          className="!px-6"
                          currencies={queryToken}
                          onImport={() => queryToken[0] && handleImport(queryToken[0])}
                        />
                      )}
                      <Currency.List
                        className="divide-y hide-scrollbar divide-slate-700"
                        currencies={currencies}
                        rowRenderer={({ currency, style }) => (
                          <TokenSelectorRow
                            id={id}
                            account={address}
                            currency={currency}
                            style={style}
                            onCurrency={_onSelect}
                            fundSource={fundSource}
                            balance={balancesMap?.[currency.isNative ? AddressZero : currency.wrapped.address]}
                            price={pricesMap?.[currency.wrapped.address]}
                          />
                        )}
                      />
                      {currencies.length === 0 && !queryToken && chainId && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-xs flex italic text-slate-500">No tokens found on</span>
                            <span className="text-xs font-medium flex gap-1 italic text-slate-500">
                              <NetworkIcon width={14} height={14} chainId={chainId} /> {chains[chainId].name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </SlideIn>
            </Dialog.Content>
          </Dialog>
        )}
      </TokenSelectorListFilterByQuery>
    </>
  )
}
