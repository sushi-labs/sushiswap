import { PlusIcon } from '@heroicons/react/solid'
import { ChainId, chainShortName } from '@sushiswap/chain'
import { tryParseAmount, Type } from '@sushiswap/currency'
import { Fee } from '@sushiswap/exchange'
import { FundSource } from '@sushiswap/hooks'
import { Button, Container, Dots, Loader } from '@sushiswap/ui'
import { Widget } from '@sushiswap/ui/widget'
import { Checker, PairState, PoolState, Web3Input } from '@sushiswap/wagmi'
import {
  AddSectionMyPosition,
  AddSectionReviewModalLegacy,
  AddSectionReviewModalTrident,
  AddSectionStake,
  FEE_MAP,
  Layout,
  SelectFeeWidget,
  SelectNetworkWidget,
} from 'components'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { CreateSectionReviewModalTrident } from '../components/CreateSection'
import { AMM_ENABLED_NETWORKS, TRIDENT_ENABLED_NETWORKS } from '../config'
import { isConstantProductPool, isLegacyPool } from '../lib/functions'
import { useCustomTokens } from '../lib/state/storage'
import { useTokens } from '../lib/state/token-lists'
import { PoolFinder } from '../systems/PoolFinder/PoolFinder'

const Add = () => {
  const [chainId, setChainId] = useState(ChainId.OPTIMISM)
  const [fee, setFee] = useState(2)
  const [{ input0, input1 }, setTypedAmounts] = useState<{ input0: string; input1: string }>({ input0: '', input1: '' })
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)

  const [token0, setToken0] = useState<Type | undefined>()
  const [token1, setToken1] = useState<Type | undefined>()

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (pool, poolState, value) => {
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
    [token0]
  )

  const onChangeToken1TypedAmount = useCallback(
    (pool, poolState, value) => {
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
    [token1]
  )

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

  const tridentPoolIfCreate = TRIDENT_ENABLED_NETWORKS.includes(chainId) && FEE_MAP[fee] !== Fee.DEFAULT

  return (
    <Layout>
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
              <>
                <div className="order-3 sm:order-2 flex flex-col gap-3 pb-40">
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
                        onChange={(val) => onChangeToken0TypedAmount(pool, poolState, val)}
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
                          onChange={(val) => onChangeToken1TypedAmount(pool, poolState, val)}
                          currency={token1}
                          onSelect={setToken1}
                          customTokenMap={customTokensMap}
                          onAddToken={addCustomToken}
                          onRemoveToken={removeCustomToken}
                          chainId={chainId}
                          tokenMap={tokenMap}
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
                                      <Button
                                        fullWidth
                                        onClick={() => setOpen(true)}
                                        disabled={isWritePending}
                                        size="md"
                                      >
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
                                      <Button
                                        fullWidth
                                        onClick={() => setOpen(true)}
                                        disabled={isWritePending}
                                        size="md"
                                      >
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
                                      <Button
                                        fullWidth
                                        onClick={() => setOpen(true)}
                                        disabled={isWritePending}
                                        size="md"
                                      >
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
                  {pool && (
                    <Container maxWidth={400} className="mx-auto">
                      <AddSectionStake
                        title="4. Stake Liquidity"
                        chainId={chainId}
                        poolAddress={`${chainShortName[chainId]}:${pool.liquidityToken.address}`}
                      />
                    </Container>
                  )}
                </div>
                <div className="order-1 sm:order-3">
                  {pool && (
                    <AddSectionMyPosition
                      chainId={chainId}
                      poolAddress={`${chainShortName[chainId]}:${pool.liquidityToken.address}`}
                    />
                  )}
                </div>
              </>
            )
          }}
        </PoolFinder>
      </div>
    </Layout>
  )
}

export default Add
