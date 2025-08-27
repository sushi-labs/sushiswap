import { Button } from '@sushiswap/ui'
import Link from 'next/link'
import { evmChains } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import { SendWidget } from '../wallet-holdings/send-widget'
import { TradeModal } from '../wallet-holdings/trade-modal'

export const ActionButtons = ({ token }: { token: Type }) => {
  return (
    <div className="grid relative z-40 grid-cols-2 col-span-2 gap-2 md:flex md:flex-row md:justify-center md:items-center md:col-span-2">
      <TradeModal token={token} side="buy" />
      <TradeModal token={token} side="sell" />
      <Link
        href={`/${evmChains[token.chainId].name.toLowerCase()}/explore/pools?tokenSymbols=${token.symbol}`}
        className="text-slate-50 !rounded-full bg-blue-500 font-semibold min-h-[32px] h-[32px] px-2 text-xs flex items-center justify-center w-full md:w-[64px]"
      >
        Earn
      </Link>
      <SendWidget
        triggerClassName="!min-h-[32px] !h-[32px] !p-2 text-xs w-full md:w-[64px] !rounded-full bg-![#0000001F] dark:!bg-[#FFFFFF1F]"
        hideTriggerIcon
        initialToken={token}
      />
    </div>
  )
}
