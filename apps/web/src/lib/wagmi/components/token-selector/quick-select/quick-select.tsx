import { useIsSmScreen, useMediaQuery } from '@sushiswap/hooks'
import {
  Badge,
  Currency as CurrencyComp,
  SkeletonCircle,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useEffect, useState } from 'react'
import { useSwapTokenSelect } from 'src/lib/hooks/useTokenSelect'
import type { EvmCurrency } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useQuickSelectTokens } from '../hooks/use-quick-select-tokens'
import { useQuickSelectContext } from './quick-select-provider'

export const QuickSelect = ({ type }: { type: 'INPUT' | 'OUTPUT' }) => {
  const isSmScreen = useIsSmScreen()
  const isXs = useMediaQuery({
    query: `(max-width: 400px)`,
  })

  const optionCount = isXs ? 2 : isSmScreen ? 3 : 4

  const { address } = useAccount()
  const { quickSelectTokens, isLoading } = useQuickSelectTokens({
    account: address,
    optionCount,
  })

  return (
    <div
      className={classNames(
        'flex items-center',
        isLoading ? 'gap-x-2' : 'gap-x-0',
      )}
    >
      {isLoading
        ? Array.from({ length: optionCount }).map((_, index) => (
            <SkeletonCircle radius={28} key={index} />
          ))
        : quickSelectTokens?.map((currencies, index) => (
            <QuickSelectItem key={index} type={type} currencies={currencies} />
          ))}
    </div>
  )
}

const QuickSelectItem = ({
  currencies,
  type,
}: { currencies: EvmCurrency[]; type: 'INPUT' | 'OUTPUT' }) => {
  const {
    state: { isOpen, selectedSymbol },
    mutate: { onValueChange },
  } = useQuickSelectContext()
  const mainCurrency = currencies[0]
  const { handleTokenInput, handleTokenOutput } = useSwapTokenSelect()

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

  const onSelectToken = async (currency: EvmCurrency) => {
    setExpanded(false)
    setTimeout(() => {
      onValueChange(false, currency?.symbol ?? undefined)
      if (type === 'INPUT') {
        handleTokenInput({
          token: currency,
        })
      } else {
        handleTokenOutput({
          token: currency,
        })
      }
    }, 300)
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
                  key={currency?.wrap().address + index}
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
        <div className="rounded-full p-0.5 sm:p-1">
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
  currency: EvmCurrency
  className?: string
  index: number
  totalCurrencies: number
  expanded: boolean
  onSelectToken: (currency: EvmCurrency) => void
}) => {
  const isSm = useIsSmScreen()
  const radius = 50
  const center = 95 / 2 // 47.5

  // If only 1 token, place it at 12:00. Otherwise, evenly span [π → 0]:
  const offset = isSm ? 5 : 0 // offset for small screens to start at about 11:00
  const angleForFiveOrLess =
    totalCurrencies === 1
      ? Math.PI / 2
      : Math.PI + offset - index * (Math.PI / (totalCurrencies - 1)) // start at π (9 o'clock), end at 0 (3 o'clock)

  // full-circle: start at top (-π/2) then step by 2π/total
  const startAngle = isSm ? Math.PI / 2 + Math.PI / 6 : Math.PI / 2
  // on small screens we offset by 30° (π/6) to “nudge” them a bit if you like
  const angleForSixOrMore =
    totalCurrencies === 1
      ? Math.PI / 2
      : startAngle + (index * (2 * Math.PI)) / totalCurrencies

  const angle = totalCurrencies <= 5 ? angleForFiveOrLess : angleForSixOrMore

  const x = center + Math.cos(angle) * radius
  const y = center - Math.sin(angle) * radius

  // If not yet “expanded”, keep everything at center
  const topValue = expanded ? y : center
  const leftValue = expanded ? x : center

  const [hovered, setHovered] = useState(false)
  const baseZ = 40 - index
  const hoverZ = 40

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        zIndex: hovered ? hoverZ : baseZ,
        // transitionDelay: `${index * 50}ms`, // stagger the animation, if you turn this on update the `setTimeout` in `QuickSelectItem` to match
      }}
      onClick={() => onSelectToken(currency)}
    >
      <Badge
        className="z-[11] bottom-[3%] -right-[10%]"
        position="bottom-right"
        badgeContent={
          <NetworkIcon
            type="square"
            className="rounded-sm"
            chainId={currency.chainId}
            width={13}
            height={13}
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
