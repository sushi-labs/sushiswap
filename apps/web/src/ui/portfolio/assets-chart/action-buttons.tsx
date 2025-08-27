import { Button } from '@sushiswap/ui'
import Link from 'next/link'
import { evmChains } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import { SendWidget } from '../wallet-holdings/send-widget'
import { TradeModal } from '../wallet-holdings/trade-modal'

interface ActionButtonsProps {
  token: Type
  splitRows?: boolean
}

export const ActionButtons = ({
  token,
  splitRows = false,
}: ActionButtonsProps) => {
  const baseBtnClasses =
    'text-slate-50 !rounded-full font-semibold min-h-[32px] h-[32px] px-2 text-xs flex items-center justify-center'
  const fixedWidth = splitRows ? '!w-[93px]' : 'w-full md:w-[64px]'

  const firstRow = (
    <>
      <TradeModal token={token} side="buy" triggerClassName={fixedWidth} />
      <TradeModal token={token} side="sell" triggerClassName={fixedWidth} />
      <Link
        href={`/${evmChains[token.chainId].name.toLowerCase()}/explore/pools?tokenSymbols=${token.symbol}`}
        className={`bg-blue-500 ${baseBtnClasses} ${fixedWidth}`}
      >
        Earn
      </Link>
    </>
  )

  const secondRow = (
    <>
      <SendWidget
        triggerClassName={`${fixedWidth} !min-h-[32px] !h-[32px] !p-2 text-xs !rounded-full bg-![#0000001F] dark:!bg-[#FFFFFF1F]`}
        hideTriggerIcon
        initialToken={token}
      />
      <Link
        href={`#`}
        className={`bg-blue-500 ${baseBtnClasses} ${fixedWidth}`}
      >
        More
      </Link>
    </>
  )

  return splitRows ? (
    <div className="flex relative z-40 flex-col gap-4">
      <div className="flex gap-2 justify-center">{firstRow}</div>
      <div className="flex gap-2 justify-center">{secondRow}</div>
    </div>
  ) : (
    <div className="grid relative z-40 grid-cols-2 col-span-2 gap-2 md:flex md:flex-row md:justify-center md:items-center md:col-span-2">
      {firstRow}
      {secondRow}
    </div>
  )
}
