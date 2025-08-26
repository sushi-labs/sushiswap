import { Button } from '@sushiswap/ui'
import Link from 'next/link'
import { evmChains } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import { SendWidget } from '../wallet-holdings/send-widget'

export const ActionButtons = ({ token }: { token: Type }) => {
  return (
    <div className="flex relative z-40 col-span-5 gap-2 justify-center items-center md:col-span-2">
      <Button
        // onClick={async () => {
        //   await handleTokenOutput({
        //     token: new Token({
        //       chainId: token.chainId as EvmChainId,
        //       address: token.address,
        //       decimals: token.decimals,
        //       symbol: token.symbol,
        //       name: token.name,
        //     }),
        //   })
        //   onClose?.()
        // }}
        size="xs"
        className="text-slate-50 !rounded-full bg-green-500 font-semibold hover:bg-green-500 active:bg-green-500/95 focus:bg-green-500 w-[64px] h-[32px] min-h-[32px]"
      >
        BUY
      </Button>

      <Button
        // onClick={async () => {
        //   await handleTokenInput({
        //     token: new Token({
        //       chainId: token.chainId as EvmChainId,
        //       address: token.address,
        //       decimals: token.decimals,
        //       symbol: token.symbol,
        //       name: token.name,
        //     }),
        //   })
        //   onClose?.()
        // }}
        size="xs"
        className="text-slate-50 !rounded-full bg-[#EA3830] font-semibold hover:bg-[#EA3830] active:bg-[#EA3830]/95 focus:bg-[#EA3830] w-[64px] h-[32px] min-h-[32px]"
      >
        SELL
      </Button>

      <Link
        href={`/${evmChains[token.chainId].name.toLowerCase()}/explore/pools?tokenSymbols=${token.symbol}`}
        className="text-slate-50 !rounded-full bg-blue-500 font-semibold min-h-[32px] h-[32px] px-2 text-xs flex items-center justify-center w-[64px]"
      >
        Earn
      </Link>
      <SendWidget
        triggerClassName="!min-h-[32px] !h-[32px] !p-2 text-xs w-[64px] !rounded-full bg-![#0000001F] dark:!bg-[#FFFFFF1F]"
        hideTriggerIcon
        initialToken={token}
      />
    </div>
  )
}
