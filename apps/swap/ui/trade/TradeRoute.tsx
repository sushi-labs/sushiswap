import React, { Dispatch, FC, SetStateAction, useCallback } from 'react'
import { UseTradeReturn } from '@sushiswap/react-query'
import { Dialog } from '@sushiswap/ui/future/components/dialog'
import { UseCrossChainTradeReturn } from '../../lib/useCrossChainTrade/types'
import {Sankey} from "../charts/Sankey";
export const TradeRoute: FC<{
  trade: UseTradeReturn | UseCrossChainTradeReturn | undefined
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}> = ({ open, setOpen, trade }) => {
  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])
  return (
    <Dialog maxWidth="2xl" open={open} onClose={onClose}>
      <Dialog.Content className="max-h-[320px] !max-w-2xl sm:max-h-[560px] overflow-y-scroll scroll dark:!bg-slate-800 bg-white">
        <div className="flex flex-col gap-4">
          <Dialog.Header title="Optimized route" />
          <Sankey trade={trade} />
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
