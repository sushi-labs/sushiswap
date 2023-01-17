import { ChainId, chainName } from '@sushiswap/chain'
import { Native, SUSHI, Token, Type, USDC, USDT } from '@sushiswap/currency'
import { useAddCustomToken, useBalances, useCustomTokens } from '@sushiswap/react-query'
import { useTokens } from '@sushiswap/react-query'
import { SlideIn } from '@sushiswap/ui13/components/animation'
import { Dialog } from '@sushiswap/ui13/components/dialog'
import { NetworkIcon } from '@sushiswap/ui13/components/icons'
import { Input } from '@sushiswap/ui13/components/input'
import { Search } from '@sushiswap/ui13/components/input/Search'
import { List } from '@sushiswap/ui13/components/list/List'
import React, { Dispatch, FC, memo, ReactNode, SetStateAction, useCallback, useState } from 'react'

import { usePrices } from '../../hooks'
import { TokenSelectorCurrencyList } from './TokenSelectorCurrencyList'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { TokenSelectorListFilterByQuery } from './TokenSelectorListFilterByQuery'
import { useAccount } from 'wagmi'
import { TokenSelectorCustomTokensOverlay } from './TokenSelectorCustomTokensOverlay'
import { Button } from '@sushiswap/ui13/components/button'
import { Currency } from '@sushiswap/ui13/components/currency'

interface TokenSelectorProps {
  id: string
  selected: Type | undefined
  chainId: ChainId
  onSelect(currency: Type): void
  children({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }): ReactNode
}

export const TokenSelector: FC<TokenSelectorProps> = memo(
  function TokenSelector({ id, selected, onSelect, chainId, children }) {
    const { address } = useAccount()
    const { mutate: onAddCustomToken } = useAddCustomToken()

    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])

    const { data: tokenMap } = useTokens({ chainId })
    const { data: customTokenMap } = useCustomTokens()
    const { data: pricesMap } = usePrices({ chainId })
    const { data: balancesMap } = useBalances({ chainId, account: address })

    const _onSelect = useCallback(
      (currency: Token) => {
        if (onSelect) {
          onSelect(currency)
        }

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
          customTokenMap={customTokenMap}
          pricesMap={pricesMap}
          balancesMap={balancesMap}
          chainId={chainId}
        >
          {({ currencies, query, onInput, searching, queryToken }) => (
            <Dialog open={open} onClose={handleClose}>
              <Dialog.Content className="flex flex-col gap-3 !pb-1 min-h-[75vh] sm:min-h-[60vh] px-4 sm:!rounded-[24px]">
                <SlideIn>
                  <div className="flex justify-between py-2">
                    <span className="text-lg font-semibold dark:text-slate-50 text-gray-900">Tokens</span>
                    <TokenSelectorCustomTokensOverlay />
                  </div>
                  <div className="flex gap-2">
                    <Search id={id} input={Input.Address} value={query} loading={searching} onChange={onInput} />
                  </div>

                  {/*TODO RAMIN COMMON BASES*/}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      // @ts-ignore
                      startIcon={<Currency.Icon currency={SUSHI[chainId]} width={16} height={16} />}
                      color="default"
                      variant="outlined"
                    >
                      SUSHI
                    </Button>
                    <Button
                      startIcon={<Currency.Icon currency={Native.onChain(chainId)} width={16} height={16} />}
                      color="default"
                      variant="outlined"
                    >
                      ETH
                    </Button>
                    {/*// @ts-ignore*/}
                    {USDC[chainId] && (
                      <Button
                        // @ts-ignore
                        startIcon={<Currency.Icon currency={USDC[chainId]} width={16} height={16} />}
                        color="default"
                        variant="outlined"
                      >
                        USDC
                      </Button>
                    )}
                    {/*// @ts-ignore*/}
                    {USDT[chainId] && (
                      <Button
                        // @ts-ignore
                        startIcon={<Currency.Icon currency={USDT[chainId]} width={16} height={16} />}
                        color="default"
                        variant="outlined"
                      >
                        USDT
                      </Button>
                    )}
                  </div>
                  <List.Control className="p-1 flex flex-col flex-grow gap-3">
                    {queryToken[0] && (
                      <TokenSelectorImportRow
                        currencies={queryToken}
                        onImport={() => queryToken[0] && handleImport(queryToken[0])}
                      />
                    )}
                    <TokenSelectorCurrencyList
                      selected={selected}
                      onSelect={_onSelect}
                      id={id}
                      currencies={currencies}
                      chainId={chainId}
                    />
                  </List.Control>
                  {currencies.length === 0 && !queryToken && chainId && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="text-xs flex italic text-slate-500">No tokens found on</span>
                        <span className="text-xs font-medium flex gap-1 italic text-slate-500">
                          <NetworkIcon width={14} height={14} chainId={chainId} /> {chainName[chainId]}
                        </span>
                      </div>
                    </div>
                  )}
                </SlideIn>
              </Dialog.Content>
            </Dialog>
          )}
        </TokenSelectorListFilterByQuery>
      </>
    )
  },
  (prev, next) => {
    return (
      prev.chainId === next.chainId &&
      prev.id === next.id &&
      prev.onSelect === next.onSelect &&
      prev.selected === next.selected
    )
  }
)
