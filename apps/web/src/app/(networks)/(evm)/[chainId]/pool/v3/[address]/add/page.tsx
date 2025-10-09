'use client'

import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { Collapsible, Currency, LinkInternal, classNames } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { use, useMemo, useState } from 'react'
import { usePoolsByTokenPair } from 'src/lib/hooks/usePoolsByTokenPair'
import { useConcentratedPositionInfo } from 'src/lib/wagmi/hooks/positions/hooks/useConcentratedPositionInfo'
import { formatNumber } from 'sushi'
import {
  SUSHISWAP_V3_FACTORY_ADDRESS,
  SushiSwapProtocol,
  type SushiSwapV3ChainId,
  computeSushiSwapV3PoolAddress,
  getEvmChainById,
} from 'sushi/evm'
import { useAccount } from 'wagmi'
import { ConcentratedLiquidityWidget } from '~evm/[chainId]/_ui/add-liquidity/conentrated-liquidity-widget'
import { DoesNotExistMessage } from '~evm/[chainId]/_ui/add-liquidity/does-not-exist-message'
import { SelectPriceWidget } from '~evm/[chainId]/_ui/add-liquidity/select-price-widget'
import { ConcentratedLiquidityProvider } from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { ProtocolBadge } from '~evm/[chainId]/_ui/protocol-badge'
import {
  ConcentratedLiquidityURLStateProvider,
  useConcentratedLiquidityURLState,
} from '~evm/[chainId]/pool/_ui/concentrated-liquidity-url-state-provider'

export default function Page(props: { params: Promise<{ chainId: string }> }) {
  const params = use(props.params)
  return (
    <ConcentratedLiquidityURLStateProvider
      chainId={+params.chainId as SushiSwapV3ChainId}
    >
      <ConcentratedLiquidityProvider>
        <_Add />
      </ConcentratedLiquidityProvider>
    </ConcentratedLiquidityURLStateProvider>
  )
}

const _Add = () => {
  const { address } = useAccount()
  const {
    chainId,
    token0,
    token1,
    feeAmount,
    tokensLoading,
    tokenId,
    switchTokens,
  } = useConcentratedLiquidityURLState()

  const [_invert, _setInvert] = useState(false)
  const { data: position } = useConcentratedPositionInfo({
    chainId,
    token0,
    tokenId,
    token1,
  })
  const { data: pools, isLoading: isLoadingPools } = usePoolsByTokenPair(
    token0?.wrap().id,
    token1?.wrap().id,
  )

  const poolExists = useMemo(() => {
    if (isLoadingPools) return true
    return pools?.some((pool) => {
      return (
        (pool.swapFee === feeAmount / 1000000 &&
          pool.token0.id.toLowerCase() === token0?.wrap().id.toLowerCase() &&
          pool.token1.id.toLowerCase() === token1?.wrap().id.toLowerCase()) ||
        (pool.swapFee === feeAmount / 1000000 &&
          pool.token0.id.toLowerCase() === token1?.wrap().id.toLowerCase() &&
          pool.token1.id.toLowerCase() === token0?.wrap().id.toLowerCase())
      )
    })
  }, [feeAmount, pools, token0, token1, isLoadingPools])

  const poolAddress = useMemo(
    () =>
      token0 && token1 && feeAmount && chainId
        ? computeSushiSwapV3PoolAddress({
            factoryAddress: SUSHISWAP_V3_FACTORY_ADDRESS[chainId],
            tokenA: token0.wrap(),
            tokenB: token1.wrap(),
            fee: feeAmount,
          })
        : undefined,
    [chainId, feeAmount, token0, token1],
  )

  return (
    <div className={classNames('flex flex-col gap-4 pt-6')}>
      <div>
        <LinkInternal
          className="flex w-fit items-center gap-1 "
          href={`/${getEvmChainById(chainId).key}/pool/v3/${poolAddress}`}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {token0 && token1 ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Currency.IconList
                  iconWidth={24}
                  iconHeight={24}
                  className="border-[#FFFFFF14]"
                >
                  <Currency.Icon currency={token0} />
                  <Currency.Icon currency={token1} />
                </Currency.IconList>
                <div className="border-[#E8E7EB] dark:border-[#222137] border rounded-[4px] overflow-hidden z-10 absolute bottom-[1px] -right-1">
                  <NetworkIcon
                    type="square"
                    chainId={chainId}
                    className="w-3 h-3"
                  />
                </div>
              </div>
              <div className="font-semibold">
                {token0.symbol}/{token1.symbol}
              </div>
              {ProtocolBadge[SushiSwapProtocol.SUSHISWAP_V3]}
              <div className="bg-[#F4F5F6] text-muted-foreground dark:bg-[#252A3C] dark:text-pink-200 text-xs px-2.5 py-1 rounded-full">
                {formatNumber(feeAmount / 10000)}%
              </div>
            </div>
          ) : null}
        </LinkInternal>
        <h2 className="text-2xl font-medium">Create New Position</h2>
      </div>

      {!poolExists && token0 && token1 && feeAmount ? (
        <>
          <Collapsible open={!poolExists} className="w-full">
            <DoesNotExistMessage type="SUSHISWAP_V3" />
          </Collapsible>
        </>
      ) : null}
      <div className="flex flex-col gap-4 lg:gap-8 lg:flex-row">
        <div className="lg:w-[65%]">
          <SelectPriceWidget
            chainId={chainId}
            token0={token0}
            token1={token1}
            poolAddress={poolAddress}
            tokenId={tokenId}
            feeAmount={feeAmount}
            switchTokens={switchTokens}
          />
        </div>
        <div className="lg:w-[45%]">
          <ConcentratedLiquidityWidget
            chainId={chainId}
            account={address}
            token0={token0}
            token1={token1}
            setToken0={undefined}
            setToken1={undefined}
            feeAmount={feeAmount}
            tokensLoading={tokensLoading}
            existingPosition={position ?? undefined}
            tokenId={tokenId}
            successLink={`/${getEvmChainById(chainId).key}/pool/v3/${poolAddress}/${tokenId ?? 'positions'}`}
          />
        </div>
      </div>
    </div>
  )
}
