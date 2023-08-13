'use client'

import { ArrowLeftIcon, PlusIcon } from '@heroicons/react-v1/solid'
import { SushiSwapV2Pool } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { defaultQuoteCurrency, Native, tryParseAmount, Type } from '@sushiswap/currency'
import { Button } from '@sushiswap/ui/components/button'
import { IconButton } from '@sushiswap/ui/components/iconbutton'
import { Loader } from '@sushiswap/ui/components/loader'
import { isSushiSwapV2ChainId, SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { SushiSwapV2ChainIds } from '@sushiswap/v2-sdk'
import { Address, getSushiSwapRouterContractConfig, PoolFinder, SushiSwapV2PoolState } from '@sushiswap/wagmi'
import { Web3Input } from '@sushiswap/wagmi/future/components/Web3Input'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { APPROVE_TAG_ADD_LEGACY } from 'lib/constants'
import { isSushiSwapV2Pool } from 'lib/functions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Dispatch, FC, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { SWRConfig } from 'swr'
import { AddSectionReviewModalLegacy, Layout, SelectNetworkWidget, SelectTokensWidget } from 'ui/pool'
import { ContentBlock } from 'ui/pool/AddPage/ContentBlock'

// // This function gets called at build time on server-side.
// // It may be called again, on a serverless function, if
// // revalidation is enabled and a new request comes in
// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const chainId = params?.chainId ? (parseInt(params.chainId as string) as ChainId) : ChainId.ETHEREUM
//   return {
//     props: {
//       chainId,
//     },
//   }
// }

// // This function gets called at build time on server-side.
// // It may be called again, on a serverless function, if
// // the path has not been generated.
// export const getStaticPaths: GetStaticPaths = async () => {
//   // Get the paths we want to pre-render based on supported chain ids
//   const paths = SUSHISWAP_V2_SUPPORTED_CHAIN_IDS.map((chainId) => ({
//     params: {
//       chainId: chainId.toString(),
//     },
//   }))

//   // We'll pre-render only these paths at build time.
//   // { fallback: 'blocking' } will server-render pages
//   // on-demand if the path doesn't exist.
//   return { paths, fallback: false }
// }

export default function Page({ params }: { params: { chainId: string } }) {
  const router = useRouter()
  const [chainId, setChainId] = useState(+params.chainId as SushiSwapV2ChainId)
  const [token0, setToken0] = useState<Type | undefined>(Native.onChain(chainId))
  const [token1, setToken1] = useState<Type | undefined>(
    defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency]
  )

  useEffect(() => {
    setToken0(Native.onChain(chainId))
    setToken1(defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency])
  }, [chainId])

  return (
    <SWRConfig>
      <Layout className="flex justify-center">
        <div className="flex flex-col gap-2">
          <Link className="flex items-center gap-4 mb-2 group" href={'/pool'} shallow={true}>
            <IconButton size="sm" icon={ArrowLeftIcon} name="Back" />
            <span className="group-hover:opacity-[1] transition-all opacity-0 text-sm font-medium">
              Go back to pools list
            </span>
          </Link>
          <h1 className="mt-2 text-3xl font-medium">Add Liquidity</h1>
          <h1 className="text-lg text-gray-600 dark:dark:text-slate-400 text-slate-600">
            Create a new pool or create a liquidity position on an existing pool.
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:w-[340px] md:w-[572px] gap-10">
          <div className="hidden md:block" />
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
              const title =
                !token0 || !token1 ? (
                  'Select Tokens'
                ) : [SushiSwapV2PoolState.LOADING].includes(poolState as SushiSwapV2PoolState) ? (
                  <div className="h-[20px] flex items-center justify-center">
                    <Loader width={14} />
                  </div>
                ) : [SushiSwapV2PoolState.EXISTS].includes(poolState as SushiSwapV2PoolState) ? (
                  'Add Liquidity'
                ) : (
                  'Create Pool'
                )

              return (
                <_Add
                  chainId={chainId}
                  setChainId={(chainId) => {
                    if (!isSushiSwapV2ChainId(chainId)) return
                    router.push(`/pool/add/v2/${chainId}`)
                    setChainId(chainId)
                  }}
                  pool={pool as SushiSwapV2Pool | null}
                  poolState={poolState as SushiSwapV2PoolState}
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
  pool: SushiSwapV2Pool | null
  poolState: SushiSwapV2PoolState
  title: ReactNode
  token0: Type | undefined
  token1: Type | undefined
  setToken0: Dispatch<SetStateAction<Type | undefined>>
  setToken1: Dispatch<SetStateAction<Type | undefined>>
}

const _Add: FC<AddProps> = ({ chainId, setChainId, pool, poolState, title, token0, token1, setToken0, setToken1 }) => {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (poolState === SushiSwapV2PoolState.NOT_EXISTS) {
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
      if (poolState === SushiSwapV2PoolState.NOT_EXISTS) {
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
    <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
      <SelectNetworkWidget networks={SushiSwapV2ChainIds} selectedNetwork={chainId} onSelect={setChainId} />
      <SelectTokensWidget
        chainId={chainId}
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
      />
      <ContentBlock title={<span className="text-gray-900 dark:text-white">Deposit.</span>}>
        <div className="flex flex-col gap-4">
          <Web3Input.Currency
            id="add-liquidity-token0"
            type="INPUT"
            className="p-3 bg-white dark:bg-slate-800 rounded-xl"
            chainId={chainId}
            value={input0}
            onChange={onChangeToken0TypedAmount}
            onSelect={setToken0}
            currency={token0}
            disabled={!token0}
          />
          <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
            <button type="button" className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900">
              <PlusIcon strokeWidth={3} className="w-4 h-4 dark:text-slate-400 text-slate-600" />
            </button>
          </div>
          <Web3Input.Currency
            id="add-liquidity-token1"
            type="INPUT"
            className="p-3 bg-white dark:bg-slate-800 rounded-xl"
            chainId={chainId}
            value={input1}
            onChange={onChangeToken1TypedAmount}
            onSelect={setToken1}
            currency={token1}
            disabled={!token1}
            loading={poolState === SushiSwapV2PoolState.LOADING}
          />
          <Checker.Root>
            <Checker.Connect fullWidth>
              <Checker.Network fullWidth chainId={chainId}>
                <Checker.Amounts fullWidth chainId={chainId} amounts={[parsedInput0, parsedInput1]}>
                  {(!pool || isSushiSwapV2Pool(pool)) && isSushiSwapV2ChainId(chainId) && (
                    <>
                      <Checker.ApproveERC20
                        id="approve-token-0"
                        className="whitespace-nowrap"
                        fullWidth
                        amount={parsedInput0}
                        contract={getSushiSwapRouterContractConfig(chainId).address as Address}
                      >
                        <Checker.ApproveERC20
                          id="approve-token-1"
                          className="whitespace-nowrap"
                          fullWidth
                          amount={parsedInput1}
                          contract={getSushiSwapRouterContractConfig(chainId).address as Address}
                        >
                          <Checker.Success tag={APPROVE_TAG_ADD_LEGACY}>
                            <Button size="xl" fullWidth onClick={() => setOpen(true)} testId="add-liquidity">
                              {title}
                            </Button>
                          </Checker.Success>
                        </Checker.ApproveERC20>
                      </Checker.ApproveERC20>
                      <AddSectionReviewModalLegacy
                        poolState={poolState as SushiSwapV2PoolState}
                        chainId={chainId}
                        token0={token0}
                        token1={token1}
                        input0={parsedInput0}
                        input1={parsedInput1}
                        onSuccess={() => {
                          // Clear inputs
                          setTypedAmounts({ input0: '', input1: '' })
                          close()
                        }}
                        open={open}
                        close={close}
                      />
                    </>
                  )}
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connect>
          </Checker.Root>
        </div>
      </ContentBlock>
    </div>
  )
}
