'use client'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { BladePool } from '@sushiswap/graph-client/data-api-blade-prod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogPrimitive,
  DialogTitle,
  DialogTrigger,
  IconButton,
  classNames,
} from '@sushiswap/ui'
import { type ReactNode, useMemo, useState } from 'react'
import {
  type EvmChainId,
  type EvmCurrency,
  SushiSwapProtocol,
  type SushiSwapV3FeeAmount,
} from 'sushi/evm'
import { AddLiquidityBlade } from './add-liquidity-blade'
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
  chainId,
  bladePool,
}: {
  poolType: SushiSwapProtocol
  trigger: ReactNode
  hidePoolTypeToggle?: boolean
  hideTokenSelectors?: boolean
  token0?: EvmCurrency
  token1?: EvmCurrency
  initFeeAmount?: SushiSwapV3FeeAmount
  bladePool?: BladePool
  chainId: EvmChainId
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
            chainId={chainId}
          />
        )

      case 'SUSHISWAP_V3':
        return (
          <AddLiquidityV3
            hideTokenSelectors={hideTokenSelectors}
            initToken0={token0}
            initToken1={token1}
            feeAmount={initFeeAmount}
            chainId={chainId}
          />
        )
      case 'BLADE':
        if (!bladePool) {
          return null
        }
        return <AddLiquidityBlade bladePool={bladePool} />
      default:
        return (
          <AddLiquidityV2
            hideTokenSelectors={hideTokenSelectors}
            initToken0={token0}
            initToken1={token1}
            chainId={chainId}
          />
        )
    }
  }, [
    type,
    token0,
    token1,
    hideTokenSelectors,
    initFeeAmount,
    bladePool,
    chainId,
  ])

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        hideClose
        aria-describedby={undefined}
        className={classNames(
          '!px-3 border-t border-[#EBEBEB] rounded-t-none md:rounded-t-2xl !bg-slate-50 dark:border-[#FFFFFF14] dark:!bg-slate-800 w-full !max-w-full md:!max-w-[640px] max-h-[100dvh] overflow-y-auto hide-scrollbar',
        )}
      >
        <DialogPrimitive.Close
          asChild
          className={'absolute top-6 right-6'}
          id="add-liquidity-dialog-close"
        >
          <IconButton variant={'ghost'} icon={XMarkIcon} name="Close" />
        </DialogPrimitive.Close>

        <div className="flex flex-col gap-6 items-start w-full md:px-4">
          <DialogTitle className="mt-4 md:mt-1 !font-medium">
            <div className="flex gap-4 items-center">
              <span>Create New Position</span>
              {hidePoolTypeToggle ? null : (
                <span className="hidden md:flex">
                  <ProtocolToggle poolType={type} setType={setType} />
                </span>
              )}
            </div>
          </DialogTitle>
          {hidePoolTypeToggle ? null : (
            <div className="flex w-full md:hidden">
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
