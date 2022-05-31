import { Currency, Token } from '@sushiswap/core-sdk'
import { TokenList } from '@uniswap/token-lists'
import { HeadlessUiModal } from 'app/components/Modal'
import usePrevious from 'app/hooks/usePrevious'
import React, { createContext, FC, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

import CurrencyModalView from './CurrencyModalView'
import { CurrencySearch } from './CurrencySearch'
import ImportList from './ImportList'
import { ImportToken } from './ImportToken'
import Manage from './Manage'

interface CurrencyModalContext {
  view: CurrencyModalView
  setView(x: CurrencyModalView): void
  importToken?: Token
  setImportToken(x: Token): void
  onDismiss(): void
  onSelect(x: Currency): void
  currency?: Currency
  includeNative?: boolean
  importList?: TokenList
  setImportList(x: TokenList): void
  listUrl?: string
  setListUrl(x: string): void
  showSearch: boolean
}

const CurrencyModalContext = createContext<CurrencyModalContext>({
  view: CurrencyModalView.search,
  setView: () => {},
  importToken: undefined,
  setImportToken: () => {},
  onDismiss: () => {},
  onSelect: () => {},
  currency: undefined,
  includeNative: true,
  importList: undefined,
  setImportList: () => {},
  listUrl: undefined,
  setListUrl: () => {},
  showSearch: true,
})

export const useCurrencyModalContext = () => useContext(CurrencyModalContext)

interface ComponentProps {
  onDismiss: () => void
  selectedCurrency?: Currency
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency
  showCommonBases?: boolean
  currencyList?: (string | undefined)[]
  includeNativeCurrency?: boolean
  allowManageTokenList?: boolean
  showSearch?: boolean
}

const Component: FC<ComponentProps> = ({
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  currencyList,
  showCommonBases = true,
  includeNativeCurrency = true,
  allowManageTokenList = true,
  showSearch = true,
}) => {
  const [view, setView] = useState<CurrencyModalView>(CurrencyModalView.search)
  const prevView = usePrevious(view)
  const [importToken, setImportToken] = useState<Token | undefined>()
  const [importList, setImportList] = useState<TokenList | undefined>()
  const [listUrl, setListUrl] = useState<string | undefined>()

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  return (
    <CurrencyModalContext.Provider
      value={useMemo(
        () => ({
          view,
          setView,
          importToken,
          setImportToken,
          importList,
          setImportList,
          onDismiss,
          onSelect: handleCurrencySelect,
          currency: selectedCurrency,
          includeNative: includeNativeCurrency,
          listUrl,
          setListUrl,
          showSearch,
        }),
        [
          handleCurrencySelect,
          importList,
          importToken,
          includeNativeCurrency,
          listUrl,
          onDismiss,
          selectedCurrency,
          showSearch,
          view,
        ]
      )}
    >
      <div className="lg:max-h-[92vh] lg:h-[40rem] h-full flex flex-col gap-4">
        {view === CurrencyModalView.search ? (
          <CurrencySearch
            otherSelectedCurrency={otherSelectedCurrency}
            showCommonBases={showCommonBases}
            currencyList={currencyList}
            allowManageTokenList={allowManageTokenList}
          />
        ) : view === CurrencyModalView.importToken && importToken ? (
          <ImportToken
            tokens={[importToken]}
            onBack={() =>
              setView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search)
            }
          />
        ) : view === CurrencyModalView.importList && importList && listUrl ? (
          <ImportList />
        ) : view === CurrencyModalView.manage ? (
          <Manage />
        ) : (
          <></>
        )}
      </div>
    </CurrencyModalContext.Provider>
  )
}

type CurrencySearchModal<P> = FC<P> & {
  Controlled: FC<CurrencySearchModalControlledProps>
}

interface CurrencySearchModalProps extends Omit<ComponentProps, 'onDismiss'> {
  trigger: ReactNode
}

const CurrencySearchModal: CurrencySearchModal<CurrencySearchModalProps> = ({ trigger, ...props }) => {
  return (
    <HeadlessUiModal trigger={trigger}>
      {/*@ts-ignore TYPE NEEDS FIXING*/}
      {({ setOpen }) => {
        return <Component {...props} onDismiss={() => setOpen(false)} />
      }}
    </HeadlessUiModal>
  )
}

interface CurrencySearchModalControlledProps extends Omit<ComponentProps, 'onDismiss'> {
  open: boolean
  onDismiss(): void
}

const CurrencySearchModalControlled: FC<CurrencySearchModalControlledProps> = ({ open, onDismiss, ...props }) => {
  return (
    <HeadlessUiModal.Controlled isOpen={open} onDismiss={onDismiss}>
      <Component {...props} onDismiss={onDismiss} />
    </HeadlessUiModal.Controlled>
  )
}

CurrencySearchModal.Controlled = CurrencySearchModalControlled
export default CurrencySearchModal
