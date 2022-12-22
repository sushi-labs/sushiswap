import { PlusIcon } from '@heroicons/react/solid'
import { ConstantProductPool, Pair, StablePool } from '@sushiswap/amm'
import { tryParseAmount } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { BreadcrumbLink, Button, classNames, Dots, Loader } from '@sushiswap/ui'
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
  AddSectionReviewModalLegacy,
  AddSectionReviewModalTrident,
  Layout,
  SelectPoolDetailsWidget,
  SettingsOverlay,
} from 'components'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { SWRConfig } from 'swr'

import { SelectPricesWidget } from '../components'
import { AddPositionProvider, useAddPositionState } from '../components/AddPositionProvider'
import { CreateSectionReviewModalTrident } from '../components/CreateSection'
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
        <div className="flex">
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
  const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  const tokenMap = useTokens(chainId)

  const tridentPoolIfCreate = TRIDENT_ENABLED_NETWORKS.includes(chainId)

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

  const widget = (
    <>
      {title === 'Create Pool' && (
        <div className="mb-3 text-[10px] leading-[16px] text-center text-slate-300 font-medium border border-slate-200/10 rounded-2xl p-3">
          This pool does not yet exist. <br /> Adding liquidity will create and set the initial price for this pool.
        </div>
      )}
      <div className="border border-slate-200/10 rounded-xl overflow-hidden bg-slate-700">
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
        <div className="relative flex items-center justify-center -mt-[12px] -mb-[12px] z-10">
          <div className="absolute h-px bg-slate-200/10 inset-0 top-[50%]" />
          <div className="group p-0.5 transition-all rounded-full px-2 bg-slate-700 z-[10]">
            <PlusIcon width={16} height={16} />
          </div>
        </div>
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
  )

  return (
    <Widget id="add-liquidity-widget" maxWidth={520} className="!bg-slate-800">
      <Widget.Content className="flex flex-col">
        <SelectPoolDetailsWidget />
        <div className="mx-4">
          <div className="h-px bg-slate-200/[0.05] w-full my-8" />
        </div>
        <div
          className={classNames(
            token0 && token1 ? '' : 'opacity-20 pointer-events-none',
            'relative flex flex-col gap-8 p-4'
          )}
        >
          {poolType === PoolFinderType.ConcentratedLiquidity && (
            <div>
              <SelectPricesWidget />
            </div>
          )}
          <div>
            <div className="flex justify-between pb-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex-grow">Set Amounts</span>
              <SettingsOverlay />
            </div>
            {widget}
          </div>
        </div>
      </Widget.Content>
    </Widget>
  )
}

export default Add
