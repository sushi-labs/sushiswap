'use client'

import { PlusIcon } from '@heroicons/react-v1/solid'
import { Fee, TridentConstantPool, TridentStablePool } from '@sushiswap/amm'
import { BENTOBOX_ADDRESS, isBentoBoxChainId } from '@sushiswap/bentobox-sdk'
import { ChainId } from 'sushi/chain'
import {
  defaultQuoteCurrency,
  Native,
  tryParseAmount,
  Type,
} from 'sushi/currency'
import {
  isTridentChainId,
  TridentChainId,
  TridentChainIds,
} from '@sushiswap/trident-sdk'
import { FormSection } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Loader } from '@sushiswap/ui/components/loader'
import {
  getTridentRouterContractConfig,
  PoolFinder,
  PoolFinderType,
  SushiSwapV2PoolState,
  TridentConstantPoolState,
  TridentStablePoolState,
} from '@sushiswap/wagmi'
import { Web3Input } from '@sushiswap/wagmi/future/components/web3-input'
import { Checker } from '@sushiswap/wagmi/future/systems'
import { CheckerProvider } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import {
  APPROVE_TAG_ADD_TRIDENT,
  APPROVE_TAG_CREATE_TRIDENT,
} from 'lib/constants'
import { isTridentConstantPool, isTridentStablePool } from 'lib/functions'
import { useRouter } from 'next/navigation'
import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { SWRConfig } from 'swr'

import { AddSectionReviewModalTrident } from '../../../../../ui/pool/AddSectionReviewModalTrident'
import { CreateSectionReviewModalTrident } from '../../../../../ui/pool/CreateSectionReviewModalTrident'
import { SelectFeeWidget } from '../../../../../ui/pool/SelectFeeWidget'
import { SelectNetworkWidget } from '../../../../../ui/pool/SelectNetworkWidget'
import { SelectPoolTypeWidget } from '../../../../../ui/pool/SelectPoolTypeWidget'
import { SelectTokensWidget } from '../../../../../ui/pool/SelectTokensWidget'

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
//   const paths = TRIDENT_ENABLED_NETWORKS.map((chainId) => ({
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
  const [chainId, setChainId] = useState(+params.chainId as TridentChainId)
  const [fee, setFee] = useState(Fee.DEFAULT)
  const [poolType, setPoolType] = useState(PoolFinderType.Classic)

  const [token0, setToken0] = useState<Type | undefined>(
    Native.onChain(chainId),
  )
  const [token1, setToken1] = useState<Type | undefined>(
    defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency],
  )

  useEffect(() => {
    setToken0(Native.onChain(chainId))
    setToken1(
      defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency],
    )
  }, [chainId])

  return (
    <SWRConfig>
      <PoolFinder
        components={
          <PoolFinder.Components>
            <PoolFinder.TridentConstantPool
              chainId={chainId}
              token0={token0}
              token1={token1}
              enabled={
                isTridentChainId(chainId) && poolType === PoolFinderType.Classic
              }
              fee={fee}
              twap={false}
            />
            <PoolFinder.TridentStablePool
              chainId={chainId}
              token0={token0}
              token1={token1}
              enabled={
                isTridentChainId(chainId) && poolType === PoolFinderType.Stable
              }
              fee={fee}
              twap={false}
            />
          </PoolFinder.Components>
        }
      >
        {({ pool: [poolState, pool] }) => {
          const title =
            !token0 || !token1 ? (
              'Select Tokens'
            ) : [
                SushiSwapV2PoolState.LOADING,
                TridentConstantPoolState.LOADING,
                TridentStablePoolState.LOADING,
              ].includes(poolState) ? (
              <div className="h-[20px] flex items-center justify-center">
                <Loader width={14} />
              </div>
            ) : [
                SushiSwapV2PoolState.EXISTS,
                TridentConstantPoolState.EXISTS,
                TridentStablePoolState.EXISTS,
              ].includes(poolState) ? (
              'Add Liquidity'
            ) : (
              'Create Pool'
            )

          return (
            <_Add
              chainId={chainId}
              setChainId={(chainId) => {
                router.push(`/pool/add/trident/${chainId}`)
                setChainId(chainId as TridentChainId)
              }}
              fee={fee}
              setFee={setFee}
              pool={pool as TridentConstantPool | TridentStablePool | null}
              poolState={
                poolState as TridentConstantPoolState | TridentStablePoolState
              }
              title={title}
              token0={token0}
              token1={token1}
              setToken0={setToken0}
              setToken1={setToken1}
              poolType={poolType}
              setPoolType={setPoolType}
            />
          )
        }}
      </PoolFinder>
    </SWRConfig>
  )
}

interface AddProps {
  chainId: ChainId
  setChainId(chainId: ChainId): void
  fee: number
  setFee(fee: number): void
  pool: TridentConstantPool | TridentStablePool | null
  poolState: TridentConstantPoolState | TridentStablePoolState
  title: ReactNode
  token0: Type | undefined
  token1: Type | undefined
  setToken0: Dispatch<SetStateAction<Type | undefined>>
  setToken1: Dispatch<SetStateAction<Type | undefined>>
  poolType: PoolFinderType
  setPoolType(type: PoolFinderType): void
}

const _Add: FC<AddProps> = ({
  chainId,
  setChainId,
  fee,
  setFee,
  pool,
  poolState,
  title,
  token0,
  token1,
  setToken0,
  setToken1,
  poolType,
  setPoolType,
}) => {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  // const [permit, setPermit] = useState<Signature>()

  const [{ input0, input1 }, setTypedAmounts] = useState<{
    input0: string
    input1: string
  }>({ input0: '', input1: '' })

  const [parsedInput0, parsedInput1] = useMemo(() => {
    return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  }, [input0, input1, token0, token1])

  const onChangeToken0TypedAmount = useCallback(
    (value: string) => {
      if (
        poolState === TridentConstantPoolState.NOT_EXISTS ||
        poolState === TridentStablePoolState.NOT_EXISTS
      ) {
        setTypedAmounts((prev) => ({
          ...prev,
          input0: value,
        }))
      } else if (token0 && pool) {
        const parsedAmount = tryParseAmount(value, token0)
        setTypedAmounts({
          input0: value,
          input1: parsedAmount
            ? pool.priceOf(token0.wrapped).quote(parsedAmount.wrapped).toExact()
            : '',
        })
      }
    },
    [pool, poolState, token0],
  )

  const onChangeToken1TypedAmount = useCallback(
    (value: string) => {
      if (
        poolState === TridentConstantPoolState.NOT_EXISTS ||
        poolState === TridentStablePoolState.NOT_EXISTS
      ) {
        setTypedAmounts((prev) => ({
          ...prev,
          input1: value,
        }))
      } else if (token1 && pool) {
        const parsedAmount = tryParseAmount(value, token1)
        setTypedAmounts({
          input0: parsedAmount
            ? pool.priceOf(token1.wrapped).quote(parsedAmount.wrapped).toExact()
            : '',
          input1: value,
        })
      }
    },
    [pool, poolState, token1],
  )

  useEffect(() => {
    if (pool) {
      onChangeToken0TypedAmount(input0)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChangeToken0TypedAmount])

  return (
    <div className="flex flex-col order-3 gap-[64px] pb-40 sm:order-2">
      <SelectNetworkWidget
        networks={TridentChainIds}
        selectedNetwork={chainId}
        onSelect={setChainId}
      />
      <SelectTokensWidget
        chainId={chainId}
        token0={token0}
        token1={token1}
        setToken0={setToken0}
        setToken1={setToken1}
      />
      <SelectPoolTypeWidget
        includeConcentrated={false}
        poolType={poolType}
        setPoolType={(type) => {
          setPoolType(type)
        }}
      />
      <SelectFeeWidget fee={fee} setFee={setFee} />
      <FormSection
        title="Deposit"
        description="Select the amount of tokens you want to deposit"
      >
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
            <button
              type="button"
              className="z-10 p-2 bg-gray-100 rounded-full dark:bg-slate-900"
            >
              <PlusIcon
                strokeWidth={3}
                className="w-4 h-4 dark:text-slate-400 text-slate-600"
              />
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
            loading={
              poolState === TridentConstantPoolState.LOADING ||
              poolState === TridentStablePoolState.LOADING
            }
          />
          <CheckerProvider>
            <Checker.Connect fullWidth>
              <Checker.Network fullWidth chainId={chainId}>
                <Checker.Amounts
                  fullWidth
                  chainId={chainId}
                  amounts={[parsedInput0, parsedInput1]}
                >
                  {pool &&
                    (isTridentConstantPool(pool) ||
                      isTridentStablePool(pool)) &&
                    isBentoBoxChainId(chainId) && (
                      <>
                        <Checker.ApproveBentobox
                          tag={APPROVE_TAG_ADD_TRIDENT}
                          chainId={chainId}
                          id="add-liquidity-trident-approve-bentobox"
                          className="whitespace-nowrap"
                          fullWidth
                          masterContract={
                            getTridentRouterContractConfig(chainId).address
                          }
                          enabled={Boolean(
                            getTridentRouterContractConfig(chainId).address,
                          )}
                        >
                          <Checker.ApproveERC20
                            id="add-liquidity-trident-approve-token0"
                            className="whitespace-nowrap"
                            fullWidth
                            amount={parsedInput0}
                            contract={BENTOBOX_ADDRESS[chainId]}
                            enabled={isBentoBoxChainId(chainId)}
                          >
                            <Checker.ApproveERC20
                              id="add-liquidity-trident-approve-token1"
                              className="whitespace-nowrap"
                              fullWidth
                              amount={parsedInput1}
                              contract={BENTOBOX_ADDRESS[chainId]}
                              enabled={isBentoBoxChainId(chainId)}
                            >
                              <Checker.Success tag={APPROVE_TAG_ADD_TRIDENT}>
                                <AddSectionReviewModalTrident
                                  poolAddress={pool.liquidityToken.address}
                                  // TODO: Shouldnt need to cast if this is done right
                                  poolState={
                                    poolState as
                                      | TridentConstantPoolState
                                      | TridentStablePoolState
                                  }
                                  pool={
                                    pool as
                                      | TridentConstantPool
                                      | TridentStablePool
                                  }
                                  chainId={chainId}
                                  token0={token0}
                                  token1={token1}
                                  input0={parsedInput0}
                                  input1={parsedInput1}
                                  onSuccess={() => {
                                    setTypedAmounts({
                                      input0: '',
                                      input1: '',
                                    })
                                  }}
                                >
                                  <Button
                                    size="xl"
                                    id="add-liquidity"
                                    fullWidth
                                  >
                                    {title}
                                  </Button>
                                </AddSectionReviewModalTrident>
                              </Checker.Success>
                            </Checker.ApproveERC20>
                          </Checker.ApproveERC20>
                        </Checker.ApproveBentobox>
                      </>
                    )}
                  {!pool && isBentoBoxChainId(chainId) && (
                    <>
                      <Checker.ApproveBentobox
                        tag={APPROVE_TAG_CREATE_TRIDENT}
                        chainId={chainId}
                        id="create-trident-approve-bentobox"
                        className="whitespace-nowrap"
                        fullWidth
                        masterContract={
                          getTridentRouterContractConfig(chainId).address
                        }
                        enabled={Boolean(
                          getTridentRouterContractConfig(chainId).address,
                        )}
                      >
                        <Checker.ApproveERC20
                          id="create-trident-approve-token0"
                          className="whitespace-nowrap"
                          fullWidth
                          amount={parsedInput0}
                          contract={BENTOBOX_ADDRESS[chainId]}
                          enabled={isBentoBoxChainId(chainId)}
                        >
                          <Checker.ApproveERC20
                            id="create-trident-approve-token1"
                            className="whitespace-nowrap"
                            fullWidth
                            amount={parsedInput1}
                            contract={BENTOBOX_ADDRESS[chainId]}
                            enabled={isBentoBoxChainId(chainId)}
                          >
                            <Checker.Success tag={APPROVE_TAG_CREATE_TRIDENT}>
                              <CreateSectionReviewModalTrident
                                chainId={chainId}
                                token0={token0}
                                token1={token1}
                                input0={parsedInput0}
                                input1={parsedInput1}
                                fee={fee}
                                poolType={poolType}
                              >
                                <Button size="xl" id="create-pool" fullWidth>
                                  {title}
                                </Button>
                              </CreateSectionReviewModalTrident>
                            </Checker.Success>
                          </Checker.ApproveERC20>
                        </Checker.ApproveERC20>
                      </Checker.ApproveBentobox>
                    </>
                  )}
                </Checker.Amounts>
              </Checker.Network>
            </Checker.Connect>
          </CheckerProvider>
        </div>
      </FormSection>
    </div>
  )
}
