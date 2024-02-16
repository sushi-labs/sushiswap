'use client'

import { SushiSwapV3ChainId } from 'sushi'
import React, { FC } from 'react'

import { CreatePositionManual } from './CreatePositionManual'

interface NewPositionProps {
  address: string
  chainId: SushiSwapV3ChainId
}

export const NewPosition: FC<NewPositionProps> = ({ address, chainId }) => {
  return <CreatePositionManual address={address} chainId={chainId} />

  // const { data: poolStats, isLoading, isError } = useConcentratedLiquidityPoolStats({ chainId, address })

  // const [selectedStrategy, setStrategy] = useState<SteerStrategy | 'Manual'>('Manual')

  // const strategyComponent = useMemo(() => {
  //   if (selectedStrategy === 'Manual') return <Manual address={address} chainId={chainId} />

  //   return SteerStrategies[selectedStrategy]
  // }, [address, chainId, selectedStrategy])

  // const strategies = useMemo(() => {
  //   const manualStrategy = {
  //     id: 'Manual',
  //     strategy: 'Manual',
  //     apr: undefined,
  //   } as const

  //   if (!poolStats?.steerVaults) return [manualStrategy]

  //   return [manualStrategy, ...poolStats.steerVaults]
  // }, [poolStats?.steerVaults])

  // if (isLoading) return <div>Loading...</div>
  // if (isError || poolStats?.steerVaults.length === 0) return <Manual address={address} chainId={chainId} />

  // Steer is WIP

  // return (
  //   <div>
  //     <div className="grid grid-cols-2">
  //       <div className="flex flex-col space-y-4">
  //         {strategies.map((vault) => (
  //           // Place a space before every capital letter
  //           <Button
  //             key={vault.id}
  //             onClick={() => setStrategy(vault.strategy)}
  //             variant="secondary"
  //             className="justify-left"
  //             size="xl"
  //           >
  //             <div className="inline-flex justify-between w-full">
  //               <div>{vault.strategy.replace(/([A-Z])/g, ' $1').trim()}</div>
  //               <div>{vault.apr ? formatPercent(vault.apr) : ''}</div>
  //             </div>
  //           </Button>
  //         ))}
  //       </div>
  //     </div>
  //     {strategyComponent}
  //   </div>
  // )
}
