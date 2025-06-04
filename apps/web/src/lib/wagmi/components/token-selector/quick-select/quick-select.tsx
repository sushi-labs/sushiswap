import { Badge, Currency as CurrencyComp, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import type { CSSProperties } from 'react'
import type { Currency } from 'sushi/currency'
import { useChipTokens } from '../hooks/use-chip-tokens'
import { useQuickSelectContext } from './quick-select-provider'

export const QuickSelect = () => {
  //@TODO: use default list of USDC/USDT/ETH/DAI for fresh user or most often used assets for common user
  const _tokens = useChipTokens({ chainId: [1, 137, 56, 10, 43114, 11155111] })
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
  // const eth = _tokens.filter((t) => t.token.symbol === "ETH").map((i) => i.token);

  return (
    <div className="flex items-center gap-x-2">
      {dai && <Item currencies={dai} />}
      {usdt && <Item currencies={usdt} />}
      {usdc && <Item currencies={usdc} />}
    </div>
  )
}

export const QuickSelectOverlay = () => {
  const {
    state: { isOpen },
    mutate: { onValueChange },
  } = useQuickSelectContext()

  return (
    <>
      {isOpen && (
        <div
          onClick={() => onValueChange(false)}
          onKeyDown={() => {
            onValueChange(false)
          }}
          className="absolute w-full h-full top-0 z-20 bottom-0 left-0 right-0 dark:bg-slate-900/70 bg-gray-100/70"
        />
      )}
    </>
  )
}

const Item = ({ currencies }: { currencies: Currency[] }) => {
  const {
    state: { isOpen, selectedSymbol },
    mutate: { onValueChange },
  } = useQuickSelectContext()
  const mainCurrency = currencies[0]

  const select = () => {
    onValueChange(true, mainCurrency?.symbol ?? undefined)
  }

  const isSelected = isOpen && selectedSymbol === mainCurrency?.symbol

  // total number of items to place around the circle
  const N = currencies?.length

  const radius = 50
  const center = 95 / 2 // 47.5
  return (
    <div
      className={classNames(
        'relative rounded-full flex items-center justify-center',
        isSelected && 'z-30',
      )}
    >
      {isSelected ? (
        <div className="bg-blue/10 absolute h-[95px] w-[95px] rounded-full">
          <div className="relative h-[95px] w-[95px] rounded-full">
            {currencies?.map((currency, index) => {
              // If only 1 token, place it at 12:00. Otherwise, evenly span [π → 0]:
              const angle =
                N === 1 ? Math.PI / 2 : Math.PI - index * (Math.PI / (N - 1)) // start at π (9 o'clock), end at 0 (3 o'clock)

              // Now compute x,y exactly:
              const x = center + Math.cos(angle) * radius
              const y = center - Math.sin(angle) * radius
              return (
                <TokenItem
                  key={currency?.wrapped.address + index}
                  currency={currency}
                  className="absolute"
                  style={{
                    top: y, // (number) => px
                    left: x,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 40 - index,
                  }}
                />
              )
            })}
          </div>
        </div>
      ) : null}
      {isSelected ? (
        <div className="bg-black/10 dark:bg-white/10 absolute h-[44px] w-[44px] rounded-full" />
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

const TokenItem = ({
  currency,
  className,
  style,
}: {
  currency: Currency
  className?: string
  style: CSSProperties
}) => {
  return (
    <button
      type="button"
      className={classNames(
        'w-[28px] h-[28px] p-4 rounded-full bg-blue/20 flex items-center justify-center shadow-[0px_0px_8px_1px_#4217FF3D]',
        className,
      )}
      style={style}
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
