import { useIsSmScreen } from '@sushiswap/hooks'
import { Badge, Currency as CurrencyComp, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useEffect, useState } from 'react'
import type { Currency } from 'sushi/currency'
import { useChipTokens } from '../hooks/use-chip-tokens'
import { useQuickSelectContext } from './quick-select-provider'

export const QuickSelect = () => {
  //@TODO: use default list of USDC/USDT/ETH/DAI for fresh user or most often used assets for common user
  const _tokens = useChipTokens({ chainId: [1, 137, 56, 10] })
  //@DEV mock list for now for ui development
  const usdc = _tokens
    .filter((t) => t.token.symbol === 'USDC')
    .map((i) => i.token)
  const dai = _tokens
    .filter((t) => t.token.symbol === 'DAI')
    .map((i) => i.token)
  const usdt = _tokens
    .filter((t) => t.token.symbol === 'USDT')
    .map((i) => i.token)

  return (
    <div className="flex items-center gap-x-2">
      {usdc && <QuickSelectItem currencies={usdc} />}
      {usdt && <QuickSelectItem currencies={usdt} />}
      {dai && <QuickSelectItem currencies={dai} />}
    </div>
  )
}

const QuickSelectItem = ({ currencies }: { currencies: Currency[] }) => {
  const {
    state: { isOpen, selectedSymbol },
    mutate: { onValueChange },
  } = useQuickSelectContext()
  const mainCurrency = currencies[0]

  const isSelected = isOpen && selectedSymbol === mainCurrency?.symbol

  // total number of items to place around the circle
  const totalCurrencies = currencies?.length

  const select = () => {
    if (isSelected) {
      setExpanded(false)
      setTimeout(() => {
        onValueChange(false, '')
      }, 300) // wait for all animations to finish before closing
    } else {
      onValueChange(true, mainCurrency?.symbol ?? undefined)
    }
  }

  // Keep track of “expanded” state: false → render at center; then flip to true → animate to (x,y)
  const [expanded, setExpanded] = useState(false)

  // Whenever isSelected flips to true, reset expanded=false, then queue expanded=true in next frame
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (isSelected) {
      setExpanded(false)
      // wait one animation frame, then expand
      timeout = setTimeout(() => {
        setExpanded(true)
      }, 100)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isSelected])

  const onSelectToken = (currency: Currency) => {
    console.log('Selected token:', currency)
    setExpanded(false)
    setTimeout(() => {
      onValueChange(false, '')
    }, 300)
    // onValueChange(false, currency?.symbol ?? undefined);
  }

  return (
    <div
      className={classNames(
        'relative rounded-full flex items-center justify-center',
        isSelected && 'z-30',
      )}
    >
      {isSelected ? (
        <div className="bg-blue/10 absolute h-[95px] w-[95px] animate-in fade-in duration-300 rounded-full">
          <div className="relative h-[95px] w-[95px] rounded-full animate-in fade-in duration-300">
            {currencies?.map((currency, index) => {
              return (
                <TokenChainItem
                  key={currency?.wrapped.address + index}
                  currency={currency}
                  expanded={expanded}
                  index={index}
                  totalCurrencies={totalCurrencies}
                  onSelectToken={onSelectToken}
                />
              )
            })}
          </div>
        </div>
      ) : null}
      {isSelected ? (
        <div className="bg-black/10 dark:bg-white/10 absolute h-[44px] w-[44px] animate-in fade-in duration-300 rounded-full" />
      ) : null}
      {/* padding div so misclicks dont happen easily */}
      {isSelected ? (
        <div className="bg-transparent absolute h-[180px] w-[180px] rounded-full" />
      ) : null}
      <button
        type="button"
        onClick={select}
        className={classNames('opacity-80', isSelected && '!opacity-100')}
      >
        <div className="rounded-full p-2 bg-slate-200 dark:bg-secondary">
          <CurrencyComp.Icon
            disableLink
            currency={mainCurrency}
            width={28}
            height={28}
          />
        </div>
      </button>
    </div>
  )
}

const TokenChainItem = ({
  currency,
  className,
  index,
  totalCurrencies,
  expanded,
  onSelectToken,
}: {
  currency: Currency
  className?: string
  index: number
  totalCurrencies: number
  expanded: boolean
  onSelectToken: (currency: Currency) => void
}) => {
  const isSm = useIsSmScreen()
  const radius = 50
  const center = 95 / 2 // 47.5
  // If only 1 token, place it at 12:00. Otherwise, evenly span [π → 0]:
  const offset = isSm ? 5 : 0 // offset for small screens to satrt al about 11:00
  const angle =
    totalCurrencies === 1
      ? Math.PI / 2
      : Math.PI + offset - index * (Math.PI / (totalCurrencies - 1)) // start at π (9 o'clock), end at 0 (3 o'clock)

  const x = center + Math.cos(angle) * radius
  const y = center - Math.sin(angle) * radius

  // If not yet “expanded”, keep everything at center
  const topValue = expanded ? y : center
  const leftValue = expanded ? x : center
  return (
    <button
      type="button"
      className={classNames(
        'w-[28px] h-[28px] p-4 rounded-full bg-blue/20 flex items-center justify-center shadow-[0px_0px_8px_1px_#4217FF3D]',
        'absolute',
        '-translate-x-1/2 -translate-y-1/2',
        'transition-all duration-200 ease-in-out',
        expanded && 'hover:scale-125',
        className,
      )}
      style={{
        //position
        top: topValue, // (number) => px
        left: leftValue,
        zIndex: 40 - index,
        // transitionDelay: `${index * 200}ms`, // stagger the animation
      }}
      onClick={() => onSelectToken(currency)}
    >
      <Badge
        className="z-[11]"
        position="bottom-right"
        badgeContent={
          <NetworkIcon
            type="square"
            className="rounded-sm"
            chainId={currency.chainId}
            width={16}
            height={16}
          />
        }
      >
        <CurrencyComp.Icon
          disableLink
          currency={currency}
          width={28}
          height={28}
        />
      </Badge>
    </button>
  )
}
