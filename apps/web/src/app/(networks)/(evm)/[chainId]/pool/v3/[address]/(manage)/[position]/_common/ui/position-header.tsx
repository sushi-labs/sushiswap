'use client'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import type { RawV3Pool } from '@sushiswap/graph-client/data-api'

import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import {
  Button,
  Currency,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IconButton,
  LinkExternal,
  SettingsModule,
  SettingsOverlay,
  WidgetAction,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/network-icon'
import { type FC, useState } from 'react'
import { ProtocolBadge } from 'src/app/(networks)/(evm)/[chainId]/_ui/protocol-badge'
import { BackButton } from 'src/app/(networks)/_ui/back-button'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-position-info'
import { useConcentratedLiquidityPositionsFromTokenId } from 'src/lib/wagmi/hooks/positions/hooks/use-concentrated-positions-from-token-id'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/use-token-with-cache'
import { getDefaultTTL } from 'src/lib/wagmi/hooks/utils/hooks/use-transaction-deadline'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { formatPercent } from 'sushi'
import {
  type EvmAddress,
  EvmChainId,
  EvmToken,
  getEvmChainById,
  unwrapEvmToken,
} from 'sushi/evm'
import { useConcentratedDerivedMintInfo } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { ConcentratedLiquidityWidget } from '~evm/[chainId]/pool/v3/_ui/concentrated-liquidity-widget'
import { ConcentratedLiquidityRemoveWidget } from './concentrated-liquidity-remove-widget'

type PoolHeader = {
  backUrl: string | undefined
  poolAddress: EvmAddress
  pool: RawV3Pool
  title: {
    main: string
    sub: string
  }
  tokenId: string
}

export const PositionHeader: FC<PoolHeader> = ({
  backUrl,
  poolAddress,
  pool,
  title,
  tokenId,
}) => {
  const [isAddLiquidityOpen, setIsAddLiquidityOpen] = useState(false)
  const [isRemoveLiquidityOpen, setIsRemoveLiquidityOpen] = useState(false)
  const _token0 =
    pool.chainId === EvmChainId.ARC
      ? new EvmToken(pool.token0)
      : unwrapEvmToken(new EvmToken(pool.token0))
  const _token1 =
    pool.chainId === EvmChainId.ARC
      ? new EvmToken(pool.token1)
      : unwrapEvmToken(new EvmToken(pool.token1))

  const address = useAccount('evm')

  const { data: positionDetails } =
    useConcentratedLiquidityPositionsFromTokenId({
      chainId: pool.chainId,
      tokenId,
    })
  const { data: token0, isLoading: token0Loading } = useTokenWithCache({
    chainId: pool.chainId,
    address: positionDetails?.token0,
  })
  const { data: token1, isLoading: token1Loading } = useTokenWithCache({
    chainId: pool.chainId,
    address: positionDetails?.token1,
  })
  const { data: position } = useConcentratedPositionInfo({
    chainId: pool.chainId,
    token0,
    tokenId,
    token1,
  })

  const { outOfRange } = useConcentratedDerivedMintInfo({
    chainId: pool.chainId,
    account: address,
    token0,
    token1,
    baseToken: token0,
    feeAmount: positionDetails?.fee,
    existingPosition: position ?? undefined,
  })

  return (
    <div className="flex flex-col gap-4">
      <BackButton
        backUrl={backUrl}
        className="text-sm text-pink hover:underline"
      />
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl md:text-4xl font-medium">{title.main}</h1>
        <h2 className="md:text-lg text-muted-foreground">{title.sub}</h2>
      </div>

      <div className="flex flex-col gap-4 md:flex-row center md:justify-between md:flex-wrap">
        <div className="flex items-center gap-1 md:gap-2.5 flex-wrap">
          <Currency.IconList iconWidth={36} iconHeight={36}>
            <Currency.Icon currency={_token0} />
            <Currency.Icon currency={_token1} />
          </Currency.IconList>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <LinkExternal
                href={getEvmChainById(pool.chainId).getAccountUrl(poolAddress)}
              >
                <Button
                  asChild
                  variant="link"
                  className={
                    'truncate overflow-x-auto !rounded-none font-semibold !text-2xl !text-primary hover:!text-pink'
                  }
                >
                  <span className="tracking-wide">
                    {_token0.symbol}/{_token1.symbol}
                  </span>
                </Button>
              </LinkExternal>
              <ProtocolBadge protocol={pool.protocol} size="lg" />
              <div className="text-muted-foreground bg-muted text-sm px-2 py-1 font-semibold mt-0.5 whitespace-nowrap rounded-full">
                {formatPercent(pool.swapFee)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <NetworkIcon chainId={pool.chainId} width={16} height={16} />
                <span className="text-sm text-muted-foreground">
                  {getEvmChainById(pool.chainId).name}
                </span>
              </div>
              <div
                className={classNames(
                  outOfRange ? 'bg-yellow/10' : 'bg-green/10',
                  'px-2 py-1 flex items-center gap-1 rounded-full',
                )}
              >
                <div
                  className={classNames(
                    outOfRange ? 'bg-yellow' : 'bg-green',
                    'w-2.5 h-2.5 rounded-full shrink-0',
                  )}
                />
                {outOfRange ? (
                  <span className="text-xs font-medium text-yellow-900 dark:text-yellow">
                    Out of Range
                  </span>
                ) : (
                  <span className="text-xs font-medium text-green">
                    In Range
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-fit">
          <Dialog
            open={isAddLiquidityOpen}
            onOpenChange={setIsAddLiquidityOpen}
          >
            <DialogTrigger asChild>
              <Button className="!px-8 w-full md:w-fit">Add Liquidity</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh]" hideClose>
              <DialogHeader className="relative">
                <DialogTitle>Add Liquidity</DialogTitle>
                <DialogDescription>
                  Provide liquidity to earn fees & rewards.
                </DialogDescription>
                <WidgetAction>
                  <SettingsOverlay
                    options={{
                      slippageTolerance: {
                        storageKey: SlippageToleranceStorageKey.AddLiquidity,
                        title: 'Add Liquidity Slippage',
                      },
                      transactionDeadline: {
                        storageKey: TTLStorageKey.AddLiquidity,
                        defaultValue: getDefaultTTL(pool.chainId).toString(),
                      },
                    }}
                    modules={[
                      SettingsModule.CustomTokens,
                      SettingsModule.SlippageTolerance,
                      SettingsModule.TransactionDeadline,
                    ]}
                  >
                    <IconButton
                      size="sm"
                      name="Settings"
                      icon={Cog6ToothIcon}
                      variant="secondary"
                      className="absolute -top-8 -right-6"
                    />
                  </SettingsOverlay>
                </WidgetAction>
              </DialogHeader>

              <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-176px)] scroll">
                <ConcentratedLiquidityWidget
                  withTitleAndDescription={false}
                  chainId={pool.chainId}
                  account={address}
                  token0={unwrapEvmToken(_token0)}
                  token1={unwrapEvmToken(_token1)}
                  feeAmount={positionDetails?.fee}
                  tokensLoading={token0Loading || token1Loading}
                  existingPosition={position ?? undefined}
                  tokenId={tokenId}
                  onPositionIncreased={() => setIsAddLiquidityOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={isRemoveLiquidityOpen}
            onOpenChange={setIsRemoveLiquidityOpen}
          >
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full md:w-fit">
                Remove Liquidity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh]" hideClose>
              <DialogHeader className="relative">
                <DialogTitle>Remove Liquidity</DialogTitle>
                <DialogDescription>
                  Remove liquidity from your position to reclaim your tokens.
                </DialogDescription>
                <WidgetAction>
                  <SettingsOverlay
                    options={{
                      slippageTolerance: {
                        storageKey: SlippageToleranceStorageKey.RemoveLiquidity,
                        title: 'Remove Liquidity Slippage',
                      },
                      transactionDeadline: {
                        storageKey: TTLStorageKey.RemoveLiquidity,
                        defaultValue: getDefaultTTL(pool.chainId).toString(),
                      },
                    }}
                    modules={[
                      SettingsModule.SlippageTolerance,
                      SettingsModule.TransactionDeadline,
                    ]}
                  >
                    <IconButton
                      size="sm"
                      name="Settings"
                      icon={Cog6ToothIcon}
                      variant="secondary"
                      className="absolute -top-8 -right-6"
                    />
                  </SettingsOverlay>
                </WidgetAction>
              </DialogHeader>

              <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(90vh-176px)] scroll">
                <ConcentratedLiquidityRemoveWidget
                  token0={_token0}
                  token1={_token1}
                  account={address}
                  chainId={pool.chainId}
                  position={position ?? undefined}
                  positionDetails={positionDetails}
                  onPositionDecreased={() => setIsRemoveLiquidityOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
