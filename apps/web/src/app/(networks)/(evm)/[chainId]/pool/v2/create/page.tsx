'use client'
import { ArrowLeftIcon } from '@heroicons/react-v1/solid'
import { useLocalStorage } from '@sushiswap/hooks'
import {
  Button,
  Collapsible,
  Currency,
  Loader,
  classNames,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { notFound, useRouter } from 'next/navigation'
import { use, useCallback, useEffect, useMemo, useState } from 'react'
import { isZapSupportedChainId } from 'src/config'
import { SushiSwapV2PoolState } from 'src/lib/wagmi/hooks/pools/hooks/useSushiSwapV2Pools'
import { PoolFinder } from 'src/lib/wagmi/systems/PoolFinder/pool-finder'
import { Amount, formatNumber } from 'sushi'
import {
  type EvmCurrency,
  defaultCurrency,
  defaultQuoteCurrency,
  isSushiSwapV2ChainId,
} from 'sushi/evm'
import type { EvmChainId } from 'sushi/evm'
import { EvmNative } from 'sushi/evm'
import { EvmToken } from 'sushi/evm'
import { SushiSwapProtocol } from 'sushi/evm'
import {
  AddLiquidityWidget,
  ZapWidget,
} from '~evm/[chainId]/_ui/add-liquidity/add-liquidity-v2'
import { DoesNotExistMessage } from '~evm/[chainId]/_ui/add-liquidity/does-not-exist-message'
import { EstimatedValue } from '~evm/[chainId]/_ui/add-liquidity/estimated-value'
import { InitialPrice } from '~evm/[chainId]/_ui/add-liquidity/initial-price'
import { ProtocolBadge } from '~evm/[chainId]/_ui/protocol-badge'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { ToggleZapCard } from '../../_ui/toggle-zap-card'

export default function Page(props: { params: Promise<{ chainId: string }> }) {
  const params = use(props.params)
  const chainId = +params.chainId as EvmChainId
  if (!isSushiSwapV2ChainId(chainId)) {
    return notFound()
  }
  const { back } = useRouter()
  const [isZapModeEnabled, setIsZapModeEnabled] = useState(false)
  const [token0, setToken0] = useState<EvmCurrency | undefined>(
    defaultCurrency[chainId],
  )
  const [token1, setToken1] = useState<EvmCurrency | undefined>(
    defaultQuoteCurrency[chainId],
  )
  const [token0V2] = useLocalStorage<EvmCurrency | null>(
    `add-liquidity-v2-token0-${chainId}`,
    null,
  )
  const [token1V2] = useLocalStorage<EvmCurrency | null>(
    `add-liquidity-v2-token1-${chainId}`,
    null,
  )
  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })
  const [initialPrice, _setInitialPrice] = useState<{
    token0Per1: string | undefined
    token1Per0: string | undefined
  }>({ token0Per1: undefined, token1Per0: undefined })

  const [independendField, setIndependendField] = useState(0)

  useEffect(() => {
    if (token0V2) {
      const _token =
        token0V2?.type === 'native'
          ? EvmNative.fromChainId(chainId)
          : new EvmToken({
              chainId: token0V2.chainId,
              address: token0V2.address,
              decimals: token0V2.decimals,
              symbol: token0V2.symbol,
              name: token0V2.name,
            })
      setToken0(_token)
    }
    if (token1V2) {
      const _token =
        token1V2?.type === 'native'
          ? EvmNative.fromChainId(chainId)
          : new EvmToken({
              chainId: token1V2.chainId,
              address: token1V2.address,
              decimals: token1V2.decimals,
              symbol: token1V2.symbol,
              name: token1V2.name,
            })
      setToken1(_token)
    }
  }, [token0V2, token1V2, chainId])

  const _setToken0 = useCallback(
    (token: EvmCurrency | undefined): void => {
      if (token?.id === token1?.id) return

      setIndependendField(1)
      setTypedAmounts((prev) => ({ ...prev, input0: '' }))

      if (token && token1 && token.chainId !== token1.chainId) {
        setToken1(undefined)
        setTypedAmounts((prev) => ({ ...prev, input1: '' }))
      }

      setToken0(token)
    },
    [token1],
  )

  const _setToken1 = useCallback(
    (token: EvmCurrency | undefined): void => {
      if (token?.id === token0?.id) return

      setIndependendField(0)
      setTypedAmounts((prev) => ({ ...prev, input1: '' }))

      if (token && token0 && token.chainId !== token0.chainId) {
        setToken0(undefined)
        setTypedAmounts((prev) => ({ ...prev, input0: '' }))
      }

      setToken1(token)
    },
    [token0],
  )
  const { data: price0, isLoading: isPrice0Loading } = usePrice({
    chainId: token0?.chainId,
    address: token0?.wrap()?.address,
    enabled: Boolean(token0),
  })
  const { data: price1, isLoading: isPrice1Loading } = usePrice({
    chainId: token1?.chainId,
    address: token1?.wrap()?.address,
    enabled: Boolean(token1),
  })

  const estimatedValue = useMemo(() => {
    if (!token0 || !token1) return '0'
    const amount0 = Amount.tryFromHuman(token0, input0)
    const amount1 = Amount.tryFromHuman(token1, input1)
    if (!amount0 || !amount1) return '0'
    const value0 = amount0.mulHuman(price0 ?? 0)
    const value1 = amount1.mulHuman(price1 ?? 0)

    return value0.addHuman(value1.toString()).toSignificant(6)
  }, [input0, input1, token0, token1, price0, price1])

  const setInitialPrice = useCallback(
    ({
      token0Per1,
      token1Per0,
    }: { token0Per1: string | undefined; token1Per0: string | undefined }) => {
      _setInitialPrice({ token0Per1, token1Per0 })
      if (input0 && token0 && token0Per1 && input1 && token1 && token1Per0) {
        const amount0 = Amount.tryFromHuman(token0, token0Per1)?.toString()
        const amount1 = Amount.tryFromHuman(token1, '1')?.toString()
        if (amount0 && amount1) {
          setTypedAmounts((prev) => ({
            ...prev,
            input0: amount0,
            input1: amount1,
          }))
        }
      } else {
        setTypedAmounts({ input0: '', input1: '' })
      }
    },
    [input0, token0, token1, input1],
  )

  return (
    <div className={classNames('flex flex-col gap-4 pt-6')}>
      <Button
        variant="link"
        className="flex w-fit items-center !font-medium gap-1 hover:!bg-transparent !px-0"
        onClick={back}
      >
        <ArrowLeftIcon className="w-3 h-3" />
        Select A Pool
      </Button>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-medium">Create New Position:</h2>
        <div>
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
              {ProtocolBadge[SushiSwapProtocol.SUSHISWAP_V2]}
              <div className="bg-[#0000001F] text-muted-foreground dark:bg-[#252A3C] dark:text-pink-200 text-xs px-2.5 py-1 rounded-full">
                {formatNumber(0.3)}%
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <PoolFinder
        components={
          <PoolFinder.Components>
            <PoolFinder.SushiSwapV2Pool
              chainId={chainId}
              token0={token0}
              token1={token1}
              enabled={isSushiSwapV2ChainId(chainId)}
            />
          </PoolFinder.Components>
        }
      >
        {({ pool: [poolState, pool] }) => {
          const doesNotExist = poolState === SushiSwapV2PoolState.NOT_EXISTS
          if (doesNotExist) {
            setIsZapModeEnabled(false)
          }

          const title =
            !token0 || !token1 ? (
              'Select Tokens'
            ) : [SushiSwapV2PoolState.LOADING].includes(poolState) ? (
              <div className="h-[20px] flex items-center justify-center">
                <Loader width={14} />
              </div>
            ) : [SushiSwapV2PoolState.EXISTS].includes(poolState) ? (
              'Add Liquidity'
            ) : (
              'Create Pool'
            )

          return (
            <div className={classNames('flex flex-col gap-4 mt-4')}>
              {doesNotExist && token0 && token1 ? (
                <>
                  <Collapsible open={doesNotExist} className="w-full">
                    <DoesNotExistMessage type="SUSHISWAP_V2" />
                  </Collapsible>
                  <Collapsible open={doesNotExist} className="w-full">
                    <div className="flex flex-col gap-4">
                      <p className="text-base font-medium text-slate-900 dark:text-pink-100">
                        Set Price
                      </p>

                      <InitialPrice
                        token0={token0}
                        token1={token1}
                        initialPrice={initialPrice}
                        setInitialPrice={setInitialPrice}
                      />
                    </div>
                  </Collapsible>
                </>
              ) : null}

              <div>
                <p className="pb-2 text-base font-medium text-slate-900 dark:text-pink-100">
                  Deposit Tokens
                </p>

                <div className="flex flex-col gap-4">
                  {isZapSupportedChainId(chainId) &&
                  poolState === SushiSwapV2PoolState.EXISTS ? (
                    <ToggleZapCard
                      checked={isZapModeEnabled}
                      onCheckedChange={setIsZapModeEnabled}
                    />
                  ) : null}
                  {isZapModeEnabled ? (
                    <ZapWidget
                      chainId={chainId}
                      pool={pool}
                      poolState={poolState}
                      title={title}
                    />
                  ) : (
                    <AddLiquidityWidget
                      chainId={token0?.chainId ?? token1?.chainId ?? chainId}
                      pool={pool}
                      poolState={poolState}
                      title={title}
                      token0={token0}
                      token1={token1}
                      setToken0={_setToken0}
                      setToken1={_setToken1}
                      input0={input0}
                      input1={input1}
                      setTypedAmounts={setTypedAmounts}
                      independendField={independendField}
                      setIndependendField={setIndependendField}
                      hideTokenSelectors={true}
                      inputClassNames={'!bg-slate-50 dark:!bg-slate-800'}
                      initialPrice={initialPrice}
                    />
                  )}
                </div>
              </div>
              <EstimatedValue
                dollarValue={estimatedValue}
                isLoading={isPrice0Loading || isPrice1Loading}
              />
            </div>
          )
        }}
      </PoolFinder>
    </div>
  )
}
