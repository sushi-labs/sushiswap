'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Message,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@sushiswap/ui'
import {
  type SushiSwapV4ChainId,
  type SushiSwapV4PoolId,
  getSushiSwapV4Deployment,
  isSushiSwapV4FeeAmount,
  useSushiSwapV4Position,
} from 'src/lib/pool/v4'
import { EvmNative } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { useConnection } from 'wagmi'
import { ConcentratedLiquidityCollectWidget } from '~evm/[chainId]/pool/v3/[address]/(manage)/[position]/_common/ui/concentrated-liquidity-collect-widget'
import { ConcentratedLiquidityRemoveWidget } from '~evm/[chainId]/pool/v3/[address]/(manage)/[position]/_common/ui/concentrated-liquidity-remove-widget'
import { ConcentratedLiquidityWidget } from '~evm/[chainId]/pool/v3/_ui/concentrated-liquidity-widget'

export function V4PositionView({
  chainId: chainIdInput,
  poolId,
  tokenId,
}: {
  chainId: number
  poolId: SushiSwapV4PoolId
  tokenId: bigint
}) {
  const chainId = chainIdInput as SushiSwapV4ChainId
  const { address } = useConnection()
  const deployment = getSushiSwapV4Deployment(chainId)
  const positionState = useSushiSwapV4Position({
    chainId,
    deployment,
    tokenId,
  })
  const data = positionState.data
  const position = data?.position
  const poolState = positionState.poolState
  const feeAmount = data?.poolKey.fee

  if (!deployment) {
    return (
      <Message variant="warning">
        SushiSwap V4 deployment addresses are not configured for this network.
      </Message>
    )
  }

  if (
    !data ||
    !position ||
    !poolState ||
    feeAmount === undefined ||
    !isSushiSwapV4FeeAmount(feeAmount)
  ) {
    return (
      <Message variant={positionState.isError ? 'destructive' : 'warning'}>
        {positionState.isError
          ? 'This Infinity position could not be loaded.'
          : 'Loading the Infinity position…'}
      </Message>
    )
  }

  if (data.poolId.toLowerCase() !== poolId.toLowerCase()) {
    return (
      <Message variant="destructive">
        This position does not belong to the requested Infinity pool.
      </Message>
    )
  }

  const token0 =
    data.poolKey.currency0 === zeroAddress
      ? EvmNative.fromChainId(chainId)
      : position.pool.token0
  const token1 =
    data.poolKey.currency1 === zeroAddress
      ? EvmNative.fromChainId(chainId)
      : position.pool.token1
  const infinity = {
    deployment,
    poolKey: data.poolKey,
    poolId: data.poolId,
    isInitialized: poolState.isInitialized,
    owner: data.owner,
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage V4 position #{tokenId.toString()}</CardTitle>
          <CardDescription>
            Add, remove, or collect fees from this Infinity position.
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="add">
          <CardContent>
            <TabsList className="!flex">
              <TabsTrigger value="add" className="flex flex-1">
                Add
              </TabsTrigger>
              <TabsTrigger value="remove" className="flex flex-1">
                Remove
              </TabsTrigger>
              <TabsTrigger value="fees" className="flex flex-1">
                Fees
              </TabsTrigger>
            </TabsList>
          </CardContent>
          <div className="px-6">
            <Separator />
          </div>
          <TabsContent value="add">
            <CardContent>
              <ConcentratedLiquidityWidget
                withTitleAndDescription={false}
                chainId={chainId}
                account={address}
                token0={token0}
                token1={token1}
                feeAmount={feeAmount}
                tokensLoading={positionState.isInitialLoading}
                existingPosition={position}
                tokenId={tokenId}
                poolState={poolState}
                infinity={infinity}
              />
            </CardContent>
          </TabsContent>
          <TabsContent value="remove">
            <ConcentratedLiquidityRemoveWidget
              token0={token0}
              token1={token1}
              account={address}
              chainId={chainId}
              position={position}
              positionDetails={undefined}
              infinity={infinity}
              tokenId={tokenId}
            />
          </TabsContent>
          <TabsContent value="fees">
            <ConcentratedLiquidityCollectWidget
              position={position}
              positionDetails={undefined}
              token0={token0}
              token1={token1}
              chainId={chainId}
              isLoading={positionState.isInitialLoading}
              address={address}
              amounts={[undefined, undefined]}
              fiatValuesAmounts={[0, 0]}
              infinity={infinity}
              tokenId={tokenId}
              feesUnavailable
            />
          </TabsContent>
        </Tabs>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Position</CardTitle>
          <CardDescription>
            Current deposited amounts and tick range.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            {position.amount0.toSignificant(8)} {token0.symbol}
          </p>
          <p>
            {position.amount1.toSignificant(8)} {token1.symbol}
          </p>
          <p className="text-sm text-muted-foreground">
            Ticks {position.tickLower} to {position.tickUpper}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
