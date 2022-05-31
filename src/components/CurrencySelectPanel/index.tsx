import { ChevronDownIcon } from '@heroicons/react/outline'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Currency } from '@sushiswap/core-sdk'
import selectCoinAnimation from 'app/animation/select-coin.json'
import CurrencySearchModal from 'app/modals/SearchModal/CurrencySearchModal'
import Lottie from 'lottie-react'
import React, { useCallback, useState } from 'react'

import { CurrencyLogo } from '../CurrencyLogo'

interface CurrencySelectPanelProps {
  onClick?: () => void
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
}

export default function CurrencySelectPanel({
  onClick,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencySelectPanelProps) {
  const { i18n } = useLingui()

  const [modalOpen, setModalOpen] = useState(false)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <div id={id} className="p-5 rounded bg-dark-800">
      <div className="flex flex-col justify-between space-y-3 sm:space-y-0 sm:flex-row">
        <div className="w-full" onClick={onClick}>
          <div
            className="items-center h-full text-xl font-medium border-none outline-none cursor-pointer select-none"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <div className="flex">
              {currency ? (
                <CurrencyLogo currency={currency} size={'54px'} />
              ) : (
                <div className="rounded bg-dark-700" style={{ maxWidth: 54, maxHeight: 54 }}>
                  <div style={{ width: 54, height: 54 }}>
                    <Lottie animationData={selectCoinAnimation} autoplay loop />
                  </div>
                </div>
              )}

              <div className="flex flex-col items-start justify-center mx-3.5">
                <div className="flex items-center">
                  <div className="mr-1 text-lg font-bold md:text-2xl">
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                      : currency?.symbol) || (
                      <div className="px-2 py-1 mt-1 text-xs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap">
                        {i18n._(t`Select a token`)}
                      </div>
                    )}
                  </div>
                  {!disableCurrencySelect && currency && (
                    <ChevronDownIcon
                      className={`${currency ? 'text-primary' : 'text-high-emphesis'} stroke-current`}
                      width={16}
                      height={16}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal.Controlled
          open={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency ?? undefined}
          otherSelectedCurrency={otherCurrency ?? undefined}
          showCommonBases={showCommonBases}
        />
      )}
    </div>
  )
}
