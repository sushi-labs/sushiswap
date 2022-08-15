import { Currency, Dialog, Typography } from '@sushiswap/ui'
import { usePrices } from '@sushiswap/wagmi'
import { FC, useCallback, useState } from 'react'

import { KashiPair } from '../../.graphclient'
import { useTokensFromKashiPair } from '../../lib/hooks'
import { MarketButtons } from './MarketButtons'

interface MarketPositionProps {
  pair: KashiPair
  side: 'borrow' | 'lend'
}

export const MarketPosition: FC<MarketPositionProps> = ({ pair, side }) => {
  const { asset, collateral } = useTokensFromKashiPair(pair)
  const [open, setOpen] = useState(false)
  const { data: prices } = usePrices({ chainId: pair.chainId })

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const content = (
    <>
      <div className="flex justify-between items-center px-6 py-4">
        <Typography weight={600} className="text-slate-50">
          My Position
        </Typography>
        <div className="flex flex-col">
          <Typography variant="sm" weight={600} className="text-slate-50 text-right">
            $0.00
          </Typography>
          <Typography variant="xxs" weight={600} className="text-slate-400 text-right">
            0.00 {asset.symbol}
          </Typography>
        </div>
      </div>
      <div className="flex justify-between py-3 bg-white bg-opacity-[0.04] px-6 mb-0.5">
        <div className="flex gap-2 items-center">
          <Currency.Icon currency={asset} width={20} height={20} />
          <Typography variant="sm" weight={600} className="text-slate-50">
            0.00 {asset.symbol}
          </Typography>
        </div>
        <Typography variant="xs" weight={600} className="text-slate-400">
          $0.00
        </Typography>
      </div>
      <div className="flex justify-between py-3 bg-white bg-opacity-[0.04] px-6">
        <div className="flex gap-2 items-center">
          <Currency.Icon currency={collateral} width={20} height={20} />
          <Typography variant="sm" weight={700} className="text-slate-50">
            0.00 {collateral.symbol}
          </Typography>
        </div>
        <Typography variant="xs" weight={500} className="text-slate-400">
          $0.00
        </Typography>
      </div>
      <div className="flex justify-between items-center px-6 py-4">
        <Typography variant="xs" className="text-slate-200">
          Total Earned
        </Typography>
        <div className="flex flex-col">
          <Typography variant="xs" weight={600} className="text-slate-400">
            $0.00
          </Typography>
        </div>
      </div>
    </>
  )

  return (
    <>
      <div className="lg:hidden fixed bottom-6 left-0 right-0 flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex bg-blue cursor-pointer rounded-full shadow-md shadow-black/50 px-6 py-3"
        >
          <Typography variant="sm" weight={600} className="text-slate-50">
            My Position
          </Typography>
        </button>
      </div>
      <Dialog onClose={handleClose} open={open}>
        <Dialog.Content className="!pb-6">
          <Dialog.Header title="My Position" onClose={handleClose} />
          <div className="flex justify-between items-center p-2 pb-3 pt-4">
            <Typography weight={600} className="text-slate-50">
              My Position
            </Typography>
            <div className="flex flex-col">
              <Typography variant="sm" weight={600} className="text-slate-50 text-right">
                $0.00
              </Typography>
              <Typography variant="xxs" weight={600} className="text-slate-400 text-right">
                0.00 {asset.symbol}
              </Typography>
            </div>
          </div>
          <div className="flex justify-between px-2 py-1">
            <div className="flex gap-2 items-center">
              <Currency.Icon currency={asset} width={20} height={20} />
              <Typography variant="sm" weight={600} className="text-slate-50">
                0.00 {asset.symbol}
              </Typography>
            </div>
            <Typography variant="xs" weight={600} className="text-slate-400">
              $0.00
            </Typography>
          </div>
          <div className="flex justify-between px-2 py-1">
            <div className="flex gap-2 items-center">
              <Currency.Icon currency={collateral} width={20} height={20} />
              <Typography variant="sm" weight={700} className="text-slate-50">
                0.00 {collateral.symbol}
              </Typography>
            </div>
            <Typography variant="xs" weight={500} className="text-slate-400">
              $0.00
            </Typography>
          </div>
          <div className="px-2">
            <hr className="border-t border-slate-200/10 my-3 px-2" />
          </div>
          <div className="flex justify-between items-center px-2 pt-3 pb-6">
            <Typography variant="xs" className="text-slate-200">
              Total Earned
            </Typography>
            <div className="flex flex-col">
              <Typography variant="xs" weight={600} className="text-slate-400">
                $0.00
              </Typography>
            </div>
          </div>
          <div className="px-2">
            <MarketButtons side={side} pair={pair} />
          </div>
        </Dialog.Content>
      </Dialog>
      <div className="hidden lg:flex bg-slate-800 flex flex-col rounded-2xl shadow-md shadow-black/30">{content}</div>
    </>
  )
}
