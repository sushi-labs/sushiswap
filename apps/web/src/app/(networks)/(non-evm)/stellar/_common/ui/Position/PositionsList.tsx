import { Card, CardContent, CardHeader, CardTitle } from '@sushiswap/ui'
import type React from 'react'
import { useStellarWallet } from '~stellar/providers'
import { useUserPositions } from '../../lib/hooks/position/use-positions'
import { POOL_CONFIGS } from '../../lib/soroban/contract-addresses'
import { formatTokenAmount } from '../../lib/utils/format'
import { CollectFeesButton } from './CollectFeesButton'

export const PositionsList: React.FC = () => {
  const { connectedAddress, signTransaction } = useStellarWallet()
  const {
    data: positions = [],
    isLoading,
    error,
  } = useUserPositions(connectedAddress ?? undefined)

  if (!connectedAddress) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>My Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-400">
            Connect your wallet to view your positions
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>My Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-400">Loading positions...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>My Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-400">
            Error loading positions: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (positions.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle>My Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-400">
            No positions found. Create a position by adding liquidity to a pool.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle>My Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions.map((position) => {
            // Find pool config for this position
            const poolConfig = Object.values(POOL_CONFIGS).find(
              (config) =>
                (config.token0.address === position.token0 &&
                  config.token1.address === position.token1) ||
                (config.token0.address === position.token1 &&
                  config.token1.address === position.token0),
            )

            if (!poolConfig) {
              return null // Skip positions for unknown pools
            }

            const token0Code =
              position.token0 === poolConfig.token0.address
                ? poolConfig.token0.code
                : poolConfig.token1.code
            const token1Code =
              position.token1 === poolConfig.token0.address
                ? poolConfig.token0.code
                : poolConfig.token1.code

            const fees0 = formatTokenAmount(position.tokens_owed0, 7)
            const fees1 = formatTokenAmount(position.tokens_owed1, 7)

            return (
              <div
                key={position.nonce.toString()}
                className="border border-slate-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">
                      Position #{position.nonce.toString()}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {token0Code}/{token1Code} • {poolConfig.fee / 100}% fee
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Liquidity</p>
                    <p className="text-white">
                      {position.liquidity.toString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Tick Range</p>
                    <p className="text-sm text-white">
                      {position.tick_lower} to {position.tick_upper}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Fees Owed</p>
                    <p className="text-sm text-white">
                      {fees0} {token0Code} + {fees1} {token1Code}
                    </p>
                  </div>
                </div>

                <CollectFeesButton
                  tokenId={Number(position.nonce)}
                  userAddress={connectedAddress}
                  signTransaction={signTransaction}
                  token0Code={token0Code}
                  token1Code={token1Code}
                  disabled={
                    position.tokens_owed0 === 0n && position.tokens_owed1 === 0n
                  }
                />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
