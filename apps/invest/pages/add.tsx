import { PlusIcon } from '@heroicons/react/solid'
import { ChainId, chainShortName } from '@sushiswap/chain'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { ConstantProductPool, Pair } from '@sushiswap/exchange'
import { FundSource } from '@sushiswap/hooks'
import { AppearOnMount, BreadcrumbLink, Button, Container, Dots, Loader } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Checker, PairState, PoolFinder, PoolState, Web3Input } from '@sushiswap/wagmi'
import {
  AddSectionMyPosition,
  AddSectionReviewModalLegacy,
  AddSectionReviewModalTrident,
  AddSectionStake,
  FEE_MAP,
  Layout,
  PoolPositionProvider,
  PoolPositionStakedProvider,
  SelectFeeWidget,
  SelectNetworkWidget,
} from 'components'
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR, { SWRConfig } from 'swr'

import { CreateSectionReviewModalTrident } from '../components/CreateSection'
import { AMM_ENABLED_NETWORKS, TRIDENT_ENABLED_NETWORKS } from '../config'
import { isConstantProductPool, isLegacyPool } from '../lib/functions'
import { useCustomTokens } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'
import { PairWithAlias } from '../types'

const LINKS: BreadcrumbLink[] = [
  {
    href: `/add`,
    label: `Add`,
  },
]

const Add = () => {
  const [chainId, setChainId] = useState(ChainId.ETHEREUM)
  const [fee, setFee] = useState(2)

  const [token0, setToken0] = useState<Type | undefined>()
  const [token1, setToken1] = useState<Type | undefined>()

  useEffect(() => {
    setToken0(undefined)
    setToken1(undefined)
  }, [chainId])

  // Reset default fee if switching networks and not on a trident enabled network
  useEffect(() => {
    if (!TRIDENT_ENABLED_NETWORKS.includes(chainId)) {
      setFee(2)
    }
  }, [chainId])

  const tridentPoolIfCreate = TRIDENT_ENABLED_NETWORKS.includes(chainId)

  return (
    <SWRConfig>
      <Layout breadcrumbs={LINKS}>
        <div className="grid grid-cols-1 sm:grid-cols-[340px_auto] md:grid-cols-[auto_396px_264px] gap-10">
          <div className="hidden md:block" />
          <PoolFinder
            components={
              <PoolFinder.Components>
                <PoolFinder.LegacyPool
                  chainId={chainId}
                  token0={token0}
                  token1={token1}
                  enabled={AMM_ENABLED_NETWORKS.includes(chainId)}
                />
                <PoolFinder.ConstantProductPool
                  chainId={chainId}
                  token0={token0}
                  token1={token1}
                  enabled={TRIDENT_ENABLED_NETWORKS.includes(chainId)}
                  fee={FEE_MAP[fee]}
                  twap={false}
                />
              </PoolFinder.Components>
            }
          >
            {({ pool: [poolState, pool] }) => {
              const title =
                !token0 || !token1 ? (
                  'Select Tokens'
                ) : [PairState.LOADING, PoolState.LOADING].includes(poolState) ? (
                  <div className="h-[20px] flex items-center justify-center">
                    <Loader width={14} />
                  </div>
                ) : [PairState.EXISTS, PoolState.EXISTS].includes(poolState) ? (
                  'Add Liquidity'
                ) : (
                  'Create Pool'
                )

              return (
                <_Add
                  chainId={chainId}
                  setChainId={setChainId}
                  fee={fee}
                  setFee={setFee}
                  pool={pool}
                  poolState={poolState}
                  tridentPoolIfCreate={tridentPoolIfCreate}
                  title={title}
                  token0={token0}
                  token1={token1}
                  setToken0={setToken0}
                  setToken1={setToken1}
                />
              )
            }}
          </PoolFinder>
        </div>
      </Layout>
    </SWRConfig>
  )
}

interface AddProps {
  chainId: ChainId
  setChainId(chainId: ChainId): void
  fee: number
  setFee(fee: number): void
  pool: Pair | ConstantProductPool | null
  poolState: PoolState | PairState
  tridentPoolIfCreate: boolean
  title: ReactNode
  token0: Type | undefined
  token1: Type | undefined
  setToken0(token: Type): void
  setToken1(token: Type): void
}

const _Add: FC<AddProps> = ({
  chainId,
  setChainId,
  fee,
  setFee,
  pool,
  poolState,
  tridentPoolIfCreate,
  title,
  token0,
  token1,
  setToken0,
  setToken1,
}) => {
  const { data } = useSWR<{ pair: PairWithAlias }>(
    pool?.liquidityToken.address
      ? `/invest/api/pool/${chainShortName[chainId]}:${pool.liquidityToken.address.toLowerCase()}`
      : null,
    (url) => fetch(url).then((response) => response.json())
  )

  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value) => {
      console.log('typed0 value', value, [poolState === PoolState.NOT_EXISTS, token0, poolState, pool])
      if (poolState === PoolState.NOT_EXISTS) {
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
    (value) => {
      console.log('typed1 value', value)
      if (poolState === PoolState.NOT_EXISTS) {
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

  return (
    <>
      <div className="flex flex-col order-3 gap-3 pb-40 sm:order-2">
        <SelectNetworkWidget selectedNetwork={chainId} onSelect={setChainId} />
        <div className={!TRIDENT_ENABLED_NETWORKS.includes(chainId) ? 'opacity-40' : ''}>
          <SelectFeeWidget selectedNetwork={chainId} fee={fee} setFee={setFee} />
        </div>
        <Widget id="addLiquidity" maxWidth={400}>
          <Widget.Content>
            <Widget.Header title="3. Add Liquidity" />
            <Web3Input.Currency
              className="p-3"
              value={input0}
              onChange={onChangeToken0TypedAmount}
              currency={token0}
              onSelect={setToken0}
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
                onSelect={setToken1}
                customTokenMap={customTokensMap}
                onAddToken={addCustomToken}
                onRemoveToken={removeCustomToken}
                chainId={chainId}
                tokenMap={tokenMap}
                loading={poolState === PoolState.LOADING}
              />
              <div className="p-3">
                <Checker.Connected fullWidth size="md">
                  <Checker.Network fullWidth size="md" chainId={chainId}>
                    <Checker.Amounts
                      fullWidth
                      size="md"
                      chainId={chainId}
                      fundSource={FundSource.WALLET}
                      amounts={[parsedInput0, parsedInput1]}
                    >
                      {pool && isConstantProductPool(pool) && (
                        <AddSectionReviewModalTrident
                          poolAddress={pool.liquidityToken.address}
                          poolState={poolState as PoolState}
                          pool={pool}
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
                          fee={FEE_MAP[fee]}
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
          </Widget.Content>
        </Widget>
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
