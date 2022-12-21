import { PlusIcon } from '@heroicons/react/solid'
import { ConstantProductPool, Pair, StablePool } from '@sushiswap/amm'
import { chainShortName } from '@sushiswap/chain'
import { tryParseAmount } from '@sushiswap/currency'
import { Pair as PairDTO } from '@sushiswap/graph-client'
import { FundSource } from '@sushiswap/hooks'
import { AppearOnMount, BreadcrumbLink, Button, Container, Dots, Loader } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import {
  Checker,
  ConstantProductPoolState,
  PairState,
  PoolFinderType,
  StablePoolState,
  Web3Input,
} from '@sushiswap/wagmi'
import {
  AddSectionMyPosition,
  AddSectionReviewModalLegacy,
  AddSectionReviewModalTrident,
  AddSectionStake,
  Layout,
  PoolPositionProvider,
  PoolPositionStakedProvider,
  SelectPoolDetailsWidget,
  SettingsOverlay,
} from 'components'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { AddPositionProvider, useAddPositionActions, useAddPositionState } from '../components/AddPositionProvider'
import { CreateSectionReviewModalTrident } from '../components/CreateSection'
import { SelectPricesWidget } from '../components/NewPositionSection/SelectPricesWidget'
import { TRIDENT_ENABLED_NETWORKS } from '../config'
import { isConstantProductPool, isLegacyPool, isStablePool } from '../lib/functions'
import { useCustomTokens } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'

const LINKS: BreadcrumbLink[] = [
  {
    href: `/add`,
    label: `Add`,
  },
]

const Add = () => {
  return (
    <SWRConfig>
      <Layout breadcrumbs={LINKS}>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
          <AddPositionProvider>
            {({ pool: [poolState, pool] }) => <_Add pool={pool} poolState={poolState} />}
          </AddPositionProvider>
        </div>
      </Layout>
    </SWRConfig>
  )
}

interface AddProps {
  pool: Pair | ConstantProductPool | StablePool | null
  poolState: PairState | ConstantProductPoolState | StablePoolState
}

const _Add: FC<AddProps> = ({ pool, poolState }) => {
  const { chainId, token0, token1, fee, poolType } = useAddPositionState()
  const { setChainId } = useAddPositionActions()
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)

  const tridentPoolIfCreate = TRIDENT_ENABLED_NETWORKS.includes(chainId)

  const { data } = useSWR<{ pair: PairDTO }>(
    pool?.liquidityToken.address
      ? `/earn/api/pool/${chainShortName[chainId]}:${pool.liquidityToken.address.toLowerCase()}`
      : null,
    (url) => fetch(url).then((response) => response.json())
  )

  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (
        poolState === PairState.NOT_EXISTS ||
        poolState === ConstantProductPoolState.NOT_EXISTS ||
        poolState === StablePoolState.NOT_EXISTS
      ) {
        setTypedAmounts((prev) => ({
          ...prev,
          input0: value,
        }))
      } else if (token0 && pool) {
        const parsedAmount = tryParseAmount(value, token0)
        setTypedAmounts({
          input0: value,
          input1: parsedAmount ? pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact() : '',
        })
      }
    },
    [pool, poolState, token0]
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      if (
        poolState === PairState.NOT_EXISTS ||
        poolState === ConstantProductPoolState.NOT_EXISTS ||
        poolState === StablePoolState.NOT_EXISTS
      ) {
        setTypedAmounts((prev) => ({
          ...prev,
          input1: value,
        }))
      } else if (token1 && pool) {
        const parsedAmount = tryParseAmount(value, token1)
        setTypedAmounts({
          input0: parsedAmount ? pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact() : '',
          input1: value,
        })
      }
    },
    [pool, poolState, token1]
  )

  useEffect(() => {
    if (pool) {
      onChangeToken0TypedAmount(input0)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChangeToken0TypedAmount])

  const title =
    !token0 || !token1 ? (
      'Select Tokens'
    ) : [PairState.LOADING, ConstantProductPoolState.LOADING, StablePoolState.LOADING].includes(poolState) ? (
      <div className="h-[20px] flex items-center justify-center">
        <Loader width={14} />
      </div>
    ) : [PairState.EXISTS, ConstantProductPoolState.EXISTS, StablePoolState.EXISTS].includes(poolState) ? (
      'Add Liquidity'
    ) : (
      'Create Pool'
    )

  return (
    <>
      <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
        <SelectPoolDetailsWidget
          customTokenMap={customTokensMap}
          tokenMap={tokenMap}
          onAddToken={addCustomToken}
          onRemoveToken={removeCustomToken}
        />
        {poolType === PoolFinderType.ConcentratedLiquidity && <SelectPricesWidget />}
        {token0 && token1 && (
          <AppearOnMount>
            <Widget id="addLiquidity" maxWidth={400}>
              <Widget.Content>
                <Widget.Header
                  title={poolType === PoolFinderType.ConcentratedLiquidity ? '5. Add Liquidity' : '4. Add Liquidity'}
                >
                  <SettingsOverlay />
                </Widget.Header>
                <>
                  <Web3Input.Currency
                    className="p-3"
                    value={input0}
                    onChange={onChangeToken0TypedAmount}
                    currency={token0}
                    customTokenMap={customTokensMap}
                    onAddToken={addCustomToken}
                    onRemoveToken={removeCustomToken}
                    chainId={chainId}
                    tokenMap={tokenMap}
                  />
                  <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
                    <div className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full">
                      <PlusIcon width={16} height={16} />
                    </div>
                  </div>
                  <div className="bg-slate-800">
                    <Web3Input.Currency
                      className="p-3 !pb-1"
                      value={input1}
                      onChange={onChangeToken1TypedAmount}
                      currency={token1}
                      customTokenMap={customTokensMap}
                      onAddToken={addCustomToken}
                      onRemoveToken={removeCustomToken}
                      chainId={chainId}
                      tokenMap={tokenMap}
                      loading={
                        poolState === PairState.LOADING ||
                        poolState === ConstantProductPoolState.LOADING ||
                        poolState === StablePoolState.LOADING
                      }
                    />
                    <div className="p-3">
                      {title === 'Create Pool' && (
                        <div className="mb-3 text-[10px] leading-[16px] text-center text-slate-300 font-medium border border-slate-200/5 rounded-2xl p-3">
                          This pool does not yet exist. <br /> Adding liquidity will create and set the initial price
                          for this pool.
                        </div>
                      )}
                      <Checker.Connected fullWidth size="md">
                        <Checker.Network fullWidth size="md" chainId={chainId}>
                          <Checker.Amounts
                            fullWidth
                            size="md"
                            chainId={chainId}
                            fundSource={FundSource.WALLET}
                            amounts={[parsedInput0, parsedInput1]}
                          >
                            {pool && (isConstantProductPool(pool) || isStablePool(pool)) && (
                              <AddSectionReviewModalTrident
                                poolAddress={pool.liquidityToken.address}
                                // TODO: Shouldnt need to cast if this is done right
                                poolState={poolState as ConstantProductPoolState | StablePoolState}
                                pool={pool as ConstantProductPool | StablePool}
                                chainId={chainId}
                                token0={token0}
                                token1={token1}
                                input0={parsedInput0}
                                input1={parsedInput1}
                              >
                                {({ isWritePending, setOpen }) => (
                                  <Button fullWidth onClick={() => setOpen(true)} disabled={isWritePending} size="md">
                                    {isWritePending ? <Dots>Confirm transaction</Dots> : title}
                                  </Button>
                                )}
                              </AddSectionReviewModalTrident>
                            )}
                            {((pool && isLegacyPool(pool)) || (!pool && !tridentPoolIfCreate)) && (
                              <AddSectionReviewModalLegacy
                                poolState={poolState as PairState}
                                chainId={chainId}
                                token0={token0}
                                token1={token1}
                                input0={parsedInput0}
                                input1={parsedInput1}
                              >
                                {({ isWritePending, setOpen }) => (
                                  <Button fullWidth onClick={() => setOpen(true)} disabled={isWritePending} size="md">
                                    {isWritePending ? <Dots>Confirm transaction</Dots> : title}
                                  </Button>
                                )}
                              </AddSectionReviewModalLegacy>
                            )}
                            {!pool && tridentPoolIfCreate && (
                              <CreateSectionReviewModalTrident
                                chainId={chainId}
                                token0={token0}
                                token1={token1}
                                input0={parsedInput0}
                                input1={parsedInput1}
                                fee={fee}
                                poolType={poolType}
                              >
                                {({ isWritePending, setOpen }) => (
                                  <Button fullWidth onClick={() => setOpen(true)} disabled={isWritePending} size="md">
                                    {isWritePending ? <Dots>Confirm transaction</Dots> : title}
                                  </Button>
                                )}
                              </CreateSectionReviewModalTrident>
                            )}
                          </Checker.Amounts>
                        </Checker.Network>
                      </Checker.Connected>
                    </div>
                  </div>
                </>
              </Widget.Content>
            </Widget>
          </AppearOnMount>
        )}

        {pool && data?.pair && (
          <PoolPositionProvider pair={data.pair}>
            <PoolPositionStakedProvider pair={data.pair}>
              <Container maxWidth={400} className="mx-auto">
                <AddSectionStake
                  title="4. Stake Liquidity"
                  poolAddress={`${chainShortName[chainId]}:${pool.liquidityToken.address}`}
                />
              </Container>
            </PoolPositionStakedProvider>
          </PoolPositionProvider>
        )}
      </div>

      {pool && data?.pair && (
        <PoolPositionProvider pair={data.pair}>
          <PoolPositionStakedProvider pair={data.pair}>
            <div className="order-1 sm:order-3">
              <AppearOnMount>
                <AddSectionMyPosition pair={data.pair} />
              </AppearOnMount>
            </div>
          </PoolPositionStakedProvider>
        </PoolPositionProvider>
      )}
    </>
  )
}

export default Add
