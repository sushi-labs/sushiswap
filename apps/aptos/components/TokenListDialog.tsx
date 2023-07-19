import React, { CSSProperties, ReactElement, ReactNode, useCallback, useState } from 'react'
import TokenListItem from './TokenListItem'
import { Token } from 'utils/tokenType'
import { SlideIn } from '@sushiswap/ui/future/components/animation'
import { List } from '@sushiswap/ui/future/components/list/List'
import { TokenSelectorCustomTokenOverlay } from './TokenSelectorCustomTokenOverlay'
import { Modal } from '@sushiswap/ui/future/components/modal/Modal'
import { ModalType } from '@sushiswap/ui/future/components/modal/ModalProvider'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { Search } from '@sushiswap/ui/future/components/input/Search'
import { Input } from '@sushiswap/ui/future/components/input'
import { useDebounce, useLocalStorage } from '@sushiswap/hooks'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import useCustomToken from 'utils/useTokenWithCache'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { Data, useTokens } from 'utils/useTokens'

type RowCallback<TData> = (row: { index: number; style: CSSProperties }) => ReactElement
interface PropType {
  id: string
  children: ReactNode
  selected: Token
  handleChangeToken: (token: Token) => void
}
interface RowType {
  index: number
  style: CSSProperties
}

export default function TokenListDialog<TData>({ id, children, selected, handleChangeToken }: PropType) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 250)
  const { network } = useWallet()
  const { tokens } = useTokens()
  const [value, setValue] = useLocalStorage<Record<string, Data>>('sushi.customTokens.aptos', {})
  const {
    data: queryToken,
    isInitialLoading: isQueryTokenLoading,
    isSuccess,
  } = useCustomToken(Number(network?.chainId), debouncedQuery)
  const handleImport = useCallback(
    (currency: Token) => {
      const data: Data[] = [
        {
          chainId: Number(network?.chainId),
          address: currency.address,
          name: currency.name,
          symbol: currency.symbol,
          decimals: currency.decimals,
        },
      ]
      setValue((prev) => {
        return data.reduce(
          (acc, cur) => {
            acc[`${cur.chainId}:${cur.address}`] = cur
            return acc
          },
          { ...prev }
        )
      })

      handleChangeToken(currency)
    },
    [handleChangeToken]
  )
  const Row = useCallback<RowCallback<TData>>(
    ({ index, style }) => {
      return (
        <TokenListItem
          style={style}
          token={tokens[index]}
          selected={selected}
          handleChangeToken={handleChangeToken}
          id={id}
        />
      )
    },
    [selected, tokens]
  )
  return (
    <>
      {children}
      <Modal.Review modalType={ModalType.Regular} variant="transparent" tag={`${id}-token-selector-modal`}>
        {({}) => (
          <div className="flex flex-col gap-3 !pb-1 min-h-[75vh] sm:min-h-[60vh] sm:!rounded-[24px]">
            <SlideIn>
              <div className="flex justify-between py-2">
                <span className="text-lg font-semibold text-gray-900 dark:text-slate-50">Tokens</span>
                <TokenSelectorCustomTokenOverlay />
              </div>
              <div className="flex gap-2">
                <Search id={id} input={Input.Address} value={query} loading={isQueryTokenLoading} onChange={setQuery} />
              </div>
              <List.Control className="relative flex flex-col flex-grow gap-3 p-1">
                {!debouncedQuery ? (
                  <AutoSizer disableWidth>
                    {({ height }: { height: number }) => (
                      <FixedSizeList
                        width="100%"
                        height={height}
                        itemCount={tokens.length}
                        itemSize={64}
                        className={'scroll'}
                        style={{ overflow: 'overlay' }}
                      >
                        {Row}
                      </FixedSizeList>
                    )}
                  </AutoSizer>
                ) : queryToken && queryToken ? (
                  <TokenSelectorImportRow
                    token={[queryToken]}
                    onImport={() => queryToken && handleImport(queryToken)}
                  ></TokenSelectorImportRow>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="flex items-center text-xs text-gray-500 dark:text-slate-500">
                        No tokens found on <span className="font-medium">APTOS</span>.
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-500">
                        Did you try searching with the token address?
                      </span>
                    </div>
                  </div>
                )}
              </List.Control>
            </SlideIn>
          </div>
        )}
      </Modal.Review>
    </>
  )
}
