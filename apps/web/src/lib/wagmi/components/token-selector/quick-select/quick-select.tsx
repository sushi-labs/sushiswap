import { Badge, Currency as CurrencyComp, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { useEffect } from 'react'
import type { Currency } from 'sushi/currency'
import { useChipTokens } from '../hooks/use-chip-tokens'
import { useQuickSelectContext } from './quick-select-provider'

export const QuickSelect = () => {
  //@TODO: use default list of USDC/USDT/ETH/DAI for fresh user or most often used assets for common user
  const _tokens = useChipTokens({ chainId: [1, 137, 56, 10, 43114, 11155111] })
  // const usdc = _tokens.filter((t) => t.token.symbol === "USDC");
  const dai = _tokens
    .filter((t) => t.token.symbol === 'DAI')
    .map((i) => i.token)
  const usdt = _tokens
    .filter((t) => t.token.symbol === 'USDT')
    .map((i) => i.token)
  const eth = _tokens
    .filter((t) => t.token.symbol === 'ETH')
    .map((i) => i.token)

  return (
    <div className="flex items-center gap-2">
      {dai && <Item currencies={dai} />}
      {usdt && <Item currencies={usdt} />}
      {eth && <Item currencies={eth} />}
    </div>
  )
}

export const QuickSelectOverlay = () => {
  const {
    state: { isOpen },
    mutate: { onValueChange },
  } = useQuickSelectContext()
  //TODO: escape key close overlay

  return (
    <>
      {isOpen && (
        <div
          onClick={() => onValueChange(false)}
          onKeyDown={(_e) => {
            //escape key

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
  //TODO: style the currencies dyanmically around the mainCurrency
  return (
    <button
      type="button"
      onClick={select}
      className={classNames(isSelected && 'z-30')}
    >
      <CurrencyComp.Icon
        disableLink
        currency={mainCurrency}
        width={28}
        height={28}
      />
    </button>
  )
}

// const TokenItem = ({ currency }: { currency: Currency }) => {
//   return (
//     <div className="w-[28px] h-[28px]">
//       <Badge
//         className="border border-slate-900 rounded-full z-[11]"
//         position="bottom-right"
//         badgeContent={
//           <NetworkIcon chainId={currency.chainId} width={12} height={12} />
//         }
//       >
//         <CurrencyComp.Icon
//           disableLink
//           currency={currency}
//           width={28}
//           height={28}
//         />
//       </Badge>
//     </div>
//   )
// }
