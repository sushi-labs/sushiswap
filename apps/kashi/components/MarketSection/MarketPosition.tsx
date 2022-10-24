import { Currency, Dialog, Typography } from '@sushiswap/ui'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { FC, useCallback, useState } from 'react'

import { useTokensFromKashiPair } from '../../lib/hooks'
import { BorrowButtons } from '../BorrowSection'
import { LendButtons } from '../LendSection'

interface MarketPositionProps {
  pair: KashiMediumRiskLendingPairV1
  side: 'borrow' | 'lend'
}

export const MarketPosition: FC<MarketPositionProps> = ({ pair, side }) => {
  const { asset, collateral } = useTokensFromKashiPair(pair)
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const content = (
    <>
      <div className="flex items-center justify-between px-6 py-4">
        <Typography weight={600} className="text-slate-50">
          My Position
        </Typography>
        <div className="flex flex-col">
          <Typography variant="sm" weight={600} className="text-right text-slate-50">
            $0.00
          </Typography>
          <Typography variant="xxs" weight={600} className="text-right text-slate-400">
            0.00 {asset.symbol}
          </Typography>
        </div>
      </div>
      <div className="flex justify-between py-3 bg-white bg-opacity-[0.04] px-6 mb-0.5">
        <div className="flex items-center gap-2">
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
        <div className="flex items-center gap-2">
          <Currency.Icon currency={collateral} width={20} height={20} />
          <Typography variant="sm" weight={700} className="text-slate-50">
            0.00 {collateral.symbol}
          </Typography>
        </div>
        <Typography variant="xs" weight={500} className="text-slate-400">
          $0.00
        </Typography>
      </div>
      <div className="flex items-center justify-between px-6 py-4">
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
      <div className="fixed left-0 right-0 flex justify-center lg:hidden bottom-6">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex px-6 py-3 rounded-full shadow-md cursor-pointer bg-blue shadow-black/50"
        >
          <Typography variant="sm" weight={600} className="text-slate-50">
            My Position
          </Typography>
        </button>
      </div>
      <Dialog onClose={handleClose} open={open}>
        <Dialog.Content className="!pb-6">
          <Dialog.Header title="My Position" onClose={handleClose} />
          <div className="flex items-center justify-between p-2 pt-4 pb-3">
            <Typography weight={600} className="text-slate-50">
              My Position
            </Typography>
            <div className="flex flex-col">
              <Typography variant="sm" weight={600} className="text-right text-slate-50">
                $0.00
              </Typography>
              <Typography variant="xxs" weight={600} className="text-right text-slate-400">
                0.00 {asset.symbol}
              </Typography>
            </div>
          </div>
          <div className="flex justify-between px-2 py-1">
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
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
            <hr className="px-2 my-3 border-t border-slate-200/10" />
          </div>
          <div className="flex items-center justify-between px-2 pt-3 pb-6">
            <Typography variant="xs" className="text-slate-200">
              Total Earned
            </Typography>
            <div className="flex flex-col">
              <Typography variant="xs" weight={600} className="text-slate-400">
                $0.00
              </Typography>
            </div>
          </div>
          <div className="px-2">{side === 'borrow' ? <BorrowButtons pair={pair} /> : <LendButtons pair={pair} />}</div>
        </Dialog.Content>
      </Dialog>
      <div className="flex flex-col hidden shadow-md lg:flex bg-slate-800 rounded-2xl shadow-black/30">{content}</div>
    </>
  )
}
