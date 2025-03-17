import { Button } from '@sushiswap/ui'
import type { Row } from '@tanstack/react-table'
import Link from 'next/link'
import type { FC } from 'react'
import type { ConcentratedLiquidityPositionWithV3Pool } from 'src/lib/wagmi/hooks/positions/types'
import { ChainKey } from 'sushi/chain'
import type { SushiSwapV3ChainId } from 'sushi/config'
import { useAccount } from 'wagmi'
import { ConcentratedLiquidityCollectAllWidget } from './ConcentratedLiquidityCollectAllWidget'

export const ClaimPositionFeesActionsCell: FC<
  Row<{
    chainId: SushiSwapV3ChainId
    positions: ConcentratedLiquidityPositionWithV3Pool[]
  }>
> = ({ original }) => {
  const { address } = useAccount()

  return (
    <div className="flex items-center gap-2">
      <ConcentratedLiquidityCollectAllWidget
        positions={original.positions}
        chainId={original.chainId}
        account={address}
        buttonText="Claim"
      />
      <Link href={`/${ChainKey[original.chainId]}/pool`} passHref>
        <Button as="a" variant="secondary">
          View Positions
        </Button>
      </Link>
    </div>
  )
}
