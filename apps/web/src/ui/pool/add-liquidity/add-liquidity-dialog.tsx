'use client'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useMemo, useState } from 'react'
import { SushiSwapProtocol } from 'sushi'
import type { SushiSwapV3FeeAmount } from 'sushi/config'
import type { Type } from 'sushi/currency'
import { AddLiquidityV2 } from './add-liquidity-v2'
import { AddLiquidityV3 } from './add-liquidity-v3'

export const AddLiquidityDialog = ({
  poolType,
  trigger,
  hidePoolTypeToggle,
  hideTokenSelectors,
  token0,
  token1,
  initFeeAmount,
}: {
  poolType: SushiSwapProtocol
  trigger: ReactNode
  hidePoolTypeToggle?: boolean
  hideTokenSelectors?: boolean
  token0?: Type
  token1?: Type
  initFeeAmount?: SushiSwapV3FeeAmount
}) => {
  const [type, setType] = useState<SushiSwapProtocol>(poolType)

  const content = useMemo(() => {
    switch (type) {
      case 'SUSHISWAP_V2':
        return (
          <AddLiquidityV2
            hideTokenSelectors={hideTokenSelectors}
            initToken0={token0}
            initToken1={token1}
          />
        )

      case 'SUSHISWAP_V3':
        return (
          <AddLiquidityV3
            hideTokenSelectors={hideTokenSelectors}
            initToken0={token0}
            initToken1={token1}
            feeAmount={initFeeAmount}
          />
        )
      default:
        return (
          <AddLiquidityV2
            hideTokenSelectors={hideTokenSelectors}
            initToken0={token0}
            initToken1={token1}
          />
        )
    }
  }, [type, token0, token1, hideTokenSelectors, initFeeAmount])

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="!px-3 border-t border-[#EBEBEB] rounded-t-none md:rounded-t-2xl !bg-slate-50 dark:border-[#FFFFFF14] dark:!bg-slate-800 w-full !max-w-full md:!max-w-[900px] max-h-[100dvh] overflow-y-auto hide-scrollbar"
      >
        <div className="flex flex-col items-start w-full gap-6 md:px-4">
          <DialogTitle className="mt-4 md:mt-1 !font-medium">
            <div className="flex items-center gap-4">
              <span>Create New Position</span>
              {hidePoolTypeToggle ? null : (
                <span className="hidden md:flex">
                  <ProtocolToggle poolType={type} setType={setType} />
                </span>
              )}
            </div>
          </DialogTitle>
          {hidePoolTypeToggle ? null : (
            <div className="md:hidden flex w-full">
              <ProtocolToggle poolType={type} setType={setType} />
            </div>
          )}
        </div>
        <div className="md:px-4">{content}</div>
      </DialogContent>
    </Dialog>
  )
}

const ProtocolToggle = ({
  poolType,
  setType,
}: {
  poolType: SushiSwapProtocol
  setType: (type: SushiSwapProtocol) => void
}) => {
  return (
    <div className="flex gap-2 items-center w-full">
      <Button
        onClick={() => {
          setType(SushiSwapProtocol.SUSHISWAP_V2)
        }}
        variant={'outline'}
        className={classNames(
          'rounded-xl hover:!bg-[#F338C31A] hover:!text-[#F338C3] hover:dark:!bg-[#F338C31A] w-full md:w-fit',
          poolType === SushiSwapProtocol.SUSHISWAP_V2
            ? '!bg-[#F338C31A] dark:!bg-[#F338C31A] !border-[#F338C3] dark:!border-[#F338C3] text-[#F338C3] !border-solid'
            : '!bg-[#00000005] dark:!bg-[#FFFFFF05]',
        )}
        size="sm"
      >
        V2
      </Button>
      <Button
        onClick={() => {
          setType(SushiSwapProtocol.SUSHISWAP_V3)
        }}
        variant={'outline'}
        className={classNames(
          'rounded-xl hover:!bg-[#3B7EF61A] hover:!text-[#3B7EF6] hover:dark:!bg-[#3B7EF61A] w-full md:w-fit',
          poolType === SushiSwapProtocol.SUSHISWAP_V3
            ? '!bg-[#3B7EF61A] dark:!bg-[#3B7EF61A] !border-[#3B7EF6] dark:!border-[#3B7EF6] text-[#3B7EF6] !border-solid'
            : '!bg-[#00000005] dark:!bg-[#FFFFFF05]',
        )}
        size="sm"
      >
        V3
      </Button>
    </div>
  )
}
