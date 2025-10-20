import { classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionsFromTokenId'
import type { EvmCurrency, SushiSwapV3ChainId } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useConcentratedDerivedMintInfo } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'

export const RangeBadge = ({
  token0,
  token1,
  tokenId,
  chainId,
}: {
  token0: EvmCurrency
  token1: EvmCurrency
  tokenId: number
  chainId: SushiSwapV3ChainId
}) => {
  const { address } = useAccount()
  const { data: positionDetails } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId,
      tokenId,
    })
  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })

  const { outOfRange } = useConcentratedDerivedMintInfo({
    chainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount: positionDetails?.fee,
    existingPosition: position ?? undefined,
  })

  const range = useMemo(() => {
    if (outOfRange === true) return 'OUT_OF_RANGE'
    if (outOfRange === false) return 'IN_RANGE'
    return 'UNKNOWN'
  }, [outOfRange])

  return (
    <div
      className={classNames(
        range === 'OUT_OF_RANGE'
          ? 'bg-red-100/10'
          : range === 'IN_RANGE'
            ? 'bg-[#22C55E]/10'
            : 'bg-slate-500/10',
        'px-2 py-1 flex items-center gap-1 rounded-full',
      )}
    >
      <div
        className={classNames(
          range === 'OUT_OF_RANGE'
            ? 'bg-red-100'
            : range === 'IN_RANGE'
              ? 'bg-[#22C55E]'
              : 'bg-slate-500/50',
          'w-3 h-3 rounded-full',
        )}
      />
      <span
        className={classNames(
          range === 'OUT_OF_RANGE'
            ? 'text-red-100'
            : range === 'IN_RANGE'
              ? 'text-[#22C55E]'
              : 'text-muted-foreground',
          'text-xs font-medium',
        )}
      >
        {range === 'OUT_OF_RANGE'
          ? 'Out of Range'
          : range === 'IN_RANGE'
            ? 'In Range'
            : 'Unknown'}
      </span>
    </div>
  )
}
