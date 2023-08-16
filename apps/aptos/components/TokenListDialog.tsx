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
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import useTokenWithCache from 'utils/useTokenWithCache'
import { TokenSelectorImportRow } from './TokenSelectorImportRow'
import { useTokens } from 'utils/useTokens'
import { useCustomTokens } from 'utils/useCustomTokens'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { useSortedTokenList } from 'utils/useSortedTokenList'

type RowCallback<TData> = (row: { index: number; style: CSSProperties }) => ReactElement
interface PropType {
  id: string
  children: ReactNode
  selected: Token
  alteredSelected: Token
  handleChangeToken: (token: Token) => void
  handleSwap: () => void
}

export default function TokenListDialog<TData>({
  id,
  children,
  selected,
  alteredSelected,
  handleSwap,
  handleChangeToken,
}: PropType) {
  const [query, setQuery] = useState('')
  const { data: tokens } = useTokens()
  const { data: customTokens, mutate: customTokenMutate } = useCustomTokens()
  const { data: queryToken, isInitialLoading: isQueryTokenLoading } = useTokenWithCache({
    address: query,
    enabled: (query.startsWith('0x') && query.length > 65) || query == '0x1::aptos_coin::AptosCoin',
    keepPreviousData: false,
  })
  const { data: sortedTokenList } = useSortedTokenList({
    query,
    tokenMap: tokens,
    customTokenMap: customTokens,
  })
  const handleImport = useCallback(
    (currency: Token) => {
      customTokenMutate('add', [currency])
      handleChangeToken(currency)
    },
    [handleChangeToken, customTokenMutate]
  )
  const Row = useCallback<RowCallback<TData>>(
    ({ index, style }) => {
      return (
        <>
          <TokenListItem
            style={style}
            token={sortedTokenList ? sortedTokenList[index] : ({} as Token)}
            selected={selected?.address === sortedTokenList?.[index]?.address}
            alteredSelected={alteredSelected}
            handleChangeToken={handleChangeToken}
            id={id}
            handleSwap={handleSwap}
          />
        </>
      )
    },
    [selected, sortedTokenList, tokens]
  )
  return (
    <>
      {children}
      <Modal.Review modalType={ModalType.Regular} variant="transparent" tag={`${id}-token-selector-modal`}>
        {({ close }) => (
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
                {isQueryTokenLoading ? (
                  <div className="py-0.5 h-[64px] -mb-3">
                    <div className="flex items-center w-full h-full px-3 rounded-lg">
                      <div className="flex items-center justify-between flex-grow gap-2 rounded">
                        <div className="flex flex-row items-center flex-grow gap-4">
                          <Skeleton.Circle radius={40} />
                          <div className="flex flex-col items-start">
                            <Skeleton.Text fontSize="text-base" className="w-full bg-gray-300" />
                            <Skeleton.Text fontSize="text-sm" className="w-full bg-gray-100" />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <Skeleton.Text fontSize="text-base" className="bg-gray-300 w-[80px]" />
                          <Skeleton.Text fontSize="text-sm" align="right" className="bg-gray-200 w-[40px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {queryToken &&
                      !customTokens[`${queryToken.address}`] &&
                      !tokens?.[`${queryToken.address}`] && (
                        <TokenSelectorImportRow
                          id={id}
                          token={[queryToken]}
                          onImport={() => {
                            queryToken && handleImport(queryToken)
                            close()
                          }}
                        />
                      )}
                    <AutoSizer disableWidth>
                      {({ height }: { height: number }) => (
                        <FixedSizeList
                          width="100%"
                          height={height}
                          itemCount={sortedTokenList ? sortedTokenList?.length : 0}
                          itemSize={64}
                          className={'scroll'}
                          style={{ overflow: 'overlay' }}
                        >
                          {Row}
                        </FixedSizeList>
                      )}
                    </AutoSizer>
                  </>
                )}
                {sortedTokenList?.length === 0 && !queryToken && (
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
