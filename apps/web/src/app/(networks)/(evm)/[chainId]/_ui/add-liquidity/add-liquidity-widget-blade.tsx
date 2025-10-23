import { PlusIcon } from '@heroicons/react-v1/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { createErrorToast, createToast } from '@sushiswap/notifications'
import { Button } from '@sushiswap/ui'
import { waitForTransactionReceipt } from '@wagmi/core'
import { format } from 'date-fns'
import { type FC, Fragment, useMemo } from 'react'
import { APPROVE_TAG_ADD_BLADE } from 'src/lib/constants'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { useBalancesWeb3 } from 'src/lib/wagmi/hooks/balances/useBalancesWeb3'
import {
  type BladeParamResponse,
  type BladeParamResponseKatana,
  useBladeDepositParams,
} from 'src/lib/wagmi/hooks/pools/hooks/use-blade-deposit-params'
import { useBladeVestingDeposits } from 'src/lib/wagmi/hooks/positions/hooks/use-blade-vesting-deposits'
import { useWrapNative } from 'src/lib/wagmi/hooks/wnative/useWrapNative'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { Amount } from 'sushi'
import {
  type BladeChainId,
  type EvmAddress,
  EvmChainId,
  type EvmCurrency,
  EvmToken,
  addGasMargin,
  isWNativeSupported,
  unwrapEvmToken,
} from 'sushi/evm'
import { UserRejectedRequestError, parseAbi } from 'viem'
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import type { UseSimulateContractParameters } from 'wagmi'
import type { IDExtended } from './add-liquidity-blade'

type AddLiquidityWidgetBladeProps = {
  chainId: BladeChainId
  pool: BladePool
  tokens: EvmCurrency[]
  setTokens: React.Dispatch<React.SetStateAction<EvmCurrency[]>>
  maxTokens: number
  inputs: Record<IDExtended, string>
  updateInput: (
    tokenId: IDExtended,
    value: string,
    removeToken?: boolean,
  ) => void
  independendField: number
  setIndependendField: React.Dispatch<React.SetStateAction<number>>
  replaceTokenAt: (index: number, token?: EvmCurrency) => void
  removeTokenAt: (index: number) => void
}

const depositAbi = (chainId: BladeChainId) => {
  if (chainId !== EvmChainId.KATANA) {
    return parseAbi([
      'function transmitAndDeposit(uint256[] depositAmounts, uint256 nDays, uint256 poolTokens, uint256 goodUntil, (uint8 v, bytes32 r, bytes32 s) theSignature)',
    ])
  }
  return parseAbi([
    'function transmitAndDeposit(uint256[] depositAmounts, uint256 lockTime, uint256 poolTokens, uint256 goodUntil, (uint8 v, bytes32 r, bytes32 s) theSignature, bytes extraData)',
  ])
}

export const AddLiquidityWidgetBlade: FC<AddLiquidityWidgetBladeProps> = ({
  chainId,
  pool,
  tokens,
  setTokens,
  maxTokens,
  inputs,
  updateInput,
  removeTokenAt,
  replaceTokenAt,
}) => {
  const { address } = useAccount()
  const { data: vestingDesposits, refetch: refetchVestingDeposits } =
    useBladeVestingDeposits({
      contractAddress: pool.address,
      account: address,
      chainId,
    })
  const lockedUntil = vestingDesposits?.[0]
  const lockDurationIsOver = lockedUntil
    ? Number(lockedUntil) * 1000 < Date.now()
    : true

  const parsedInputs = useMemo(() => {
    return tokens
      .map((token) => {
        const value = inputs[token.id]?.trim()
        if (!value || Number(value) === 0) return null
        return Amount.tryFromHuman(token, value)
      })
      .filter((a): a is Amount<EvmCurrency> => !!a)
  }, [tokens, inputs])

  const {
    data: depositParams,
    error,
    isLoading: isLoadingParams,
    // refetch: refetchParams,
  } = useBladeDepositParams({
    sender: address,
    poolAddress: pool.address,
    chainId,
    tokens,
    inputs,
  })

  console.log('error', error)

  // const parsedInputs = useMemo(() => {
  //   return tokens.map((token) => {
  //     const value = inputs[token.id] ?? ''
  //     return Amount.tryFromHuman(token, value) || Amount.tryFromHuman(token, 0)
  //   })
  // }, [tokens, inputs])

  const parsedTokenInputs = useMemo(() => {
    return tokens.map((token) => {
      const value = inputs[token.id] ?? ''
      const _token = new EvmToken({
        chainId: token.chainId,
        address: token?.wrap().address,
        decimals: token?.decimals,
        symbol: token.symbol,
        name: token?.name,
      })
      return new Amount(_token, value) || Amount.tryFromHuman(_token, 0)
    })
  }, [tokens, inputs])

  const nativeToWrap = useMemo(() => {
    return parsedInputs.find((i) => i?.currency.isNative)
  }, [parsedInputs])

  const { data: balances } = useBalancesWeb3({
    chainId,
    currencies: nativeToWrap ? [nativeToWrap.currency.wrap()] : [],
    account: address,
    enabled: Boolean(nativeToWrap),
  })
  const wrappedBalance =
    nativeToWrap && balances?.[nativeToWrap?.currency?.wrap()?.address]

  const wrapNative = useWrapNative({
    amount: nativeToWrap,
    enabled: Boolean(nativeToWrap),
  })

  const prepare = useMemo(() => {
    if (!depositParams) {
      return undefined
    }

    const amounts = depositParams.deposit_amounts.map(
      BigInt,
    ) as readonly bigint[]
    const sig = {
      v: depositParams.signature.v,
      r: depositParams.signature.r,
      s: depositParams.signature.s,
    } as const

    let args
    if (chainId === EvmChainId.KATANA) {
      const _depositParams = depositParams as BladeParamResponseKatana
      args = [
        amounts,
        BigInt(_depositParams.lock_time),
        BigInt(_depositParams.pool_tokens),
        BigInt(_depositParams.good_until),
        sig,
        _depositParams.extra_data,
      ] as const
    } else {
      const _depositParams = depositParams as BladeParamResponse
      args = [
        amounts,
        BigInt(_depositParams.n_days),
        BigInt(_depositParams.pool_tokens),
        BigInt(_depositParams.good_until),
        sig,
      ] as const
    }
    return {
      account: depositParams.sender,
      address: depositParams.clipper_exchange_address,
      chainId,
      abi: depositAbi(chainId),
      functionName: 'transmitAndDeposit',
      args,
      value: 0n,
    } as const satisfies UseSimulateContractParameters
  }, [depositParams, chainId])

  const {
    data: simulation,
    isLoading: isSimLoading,
    error: simError,
    //@ts-expect-error - prepare could have 6 or 7 args depending on chain
  } = useSimulateContract({
    ...(prepare as NonNullable<typeof prepare>),
    chainId,
    query: {
      enabled: Boolean(prepare),
    },
  })

  const simErrorMessage = useMemo(() => {
    if (!simError) return undefined
    if (typeof simError === 'string') return simError
    if (simError?.message) {
      const clipperError = simError.message
        .split('ClipperDirect: ')?.[1]
        ?.split('\n')?.[0]
      if (clipperError) {
        return clipperError
      }
      const contractError = simError.message
        .split('reason:')?.[1]
        ?.split('\n')?.[1]
      if (contractError) {
        return contractError
      }
    }
    return 'An error occurred during simulation'
  }, [simError])

  const { writeContractAsync, data: txnHash } = useWriteContract()

  const { status } = useWaitForTransactionReceipt({ chainId, hash: txnHash })

  const deposit = async () => {
    if (!simulation) {
      return createErrorToast(
        simError?.message || 'Simulation failed. Please try again.',
        true,
      )
    }
    try {
      const hash = await writeContractAsync({
        ...simulation?.request,
        gas: simulation?.request.gas
          ? addGasMargin(simulation.request.gas)
          : undefined,
      })

      const receipt = waitForTransactionReceipt(getWagmiConfig(), {
        chainId,
        hash: hash,
      })
      const token = pool.tokens[0]
      const ts = new Date().getTime()

      for (const token of tokens) {
        updateInput(token.id, '', true) // Clear input for the token being deposited
      }
      void createToast({
        account: address,
        type: 'addLiquidity',
        chainId,
        txHash: hash,
        promise: receipt,
        summary: {
          pending: `Adding liquidity to the ${token.token.symbol}/USD pool`,
          completed: `Successfully added liquidity to the ${token.token.symbol}/USD pool`,
          failed: 'Something went wrong when adding liquidity',
        },
        timestamp: ts,
        groupTimestamp: ts,
      })
      await refetchVestingDeposits()
      const closeDialogBtn = document.getElementById(
        'add-liquidity-dialog-close',
      )
      if (closeDialogBtn) {
        closeDialogBtn.click() // Close the dialog after deposit
      }
    } catch (error: unknown) {
      console.error('Error sending deposit transaction', error)
      // Check if error has a 'cause' property and if it's a UserRejectedRequestError
      const err = error as any
      if (!(err?.cause instanceof UserRejectedRequestError)) {
        createErrorToast(
          (err?.message as string) ||
            'Something went wrong when adding liquidity',
          true,
        )
      }
    }
  }

  const allTokens = useMemo(() => {
    return pool.tokens.map((token) =>
      unwrapEvmToken(
        new EvmToken({
          chainId: chainId,
          address: token.token.address as EvmAddress,
          decimals: token.token.decimals,
          symbol: token.token.symbol,
          name: token.token.name,
        }),
      ),
    )
  }, [pool, chainId])

  const currencies = useMemo(() => {
    return allTokens
      .filter((i) => !tokens.some((x) => x.id === i.id))
      .reduce<Record<string, EvmCurrency>>((acc, cur) => {
        acc[cur.wrap().address] = cur
        return acc
      }, {})
  }, [allTokens, tokens])

  const renderTokenRow = (t: EvmCurrency, i: number) => {
    const value = inputs[t.id] ?? ''

    const onChange = (v: string) => updateInput(t.id, v)

    const onSelect = (next?: EvmCurrency) => replaceTokenAt(i, next)

    return (
      <Fragment key={`${t.id}-${i}`}>
        <div className="flex gap-2 items-start relative">
          {i > 0 && (
            <button
              type="button"
              onClick={() => removeTokenAt(i)}
              className="px-3 w-9 bg-gray-100 rounded-full z-10 aspect-1 shrink-0 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-800 absolute top-1 left-1"
              aria-label="Remove token"
            >
              ✕
            </button>
          )}
          <Web3Input.Currency
            id={`add-liquidity-token-${i}`}
            type="INPUT"
            className="flex-1 p-4 bg-gray-100 rounded-xl dark:bg-slate-900"
            currencies={currencies}
            chainId={chainId}
            value={value}
            onChange={onChange}
            onSelect={
              Object.keys(currencies).length === 0 || pool?.isDeprecated
                ? undefined
                : onSelect
            }
            currency={t}
            hidePercentageInputs
            disabled={!t || pool?.isDeprecated}
            allowNative={isWNativeSupported(chainId)}
          />
        </div>
        {i < maxTokens - 1 && tokens[i + 1] && (
          <div className="left-0 right-0 mt-[-24px] mb-[-24px] flex items-center justify-center">
            <button
              type="button"
              className="z-10 p-2 bg-gray-100 rounded-full border dark:bg-slate-900 border-slate-50 dark:border-slate-800"
            >
              <PlusIcon
                strokeWidth={3}
                className="w-4 h-4 dark:text-skyblue text-blue"
              />
            </button>
          </div>
        )}
      </Fragment>
    )
  }

  const errorMessage = useMemo(() => {
    if (!error) return undefined

    if ('issues' in (error as any) && Array.isArray((error as any).issues)) {
      return (error as any).issues[0]?.message
    }

    if ('message' in (error as any)) {
      return (error as any).message
    }

    return undefined
  }, [error])

  return (
    <div className="flex flex-col gap-4 mb-10">
      {/* Dynamic token rows */}
      <div className="flex flex-col gap-3">
        {tokens.map((t, i) => renderTokenRow(t, i))}
      </div>
      {tokens.length < maxTokens && (
        <button
          type="button"
          className="flex gap-1 items-center pt-3 mx-auto"
          disabled={pool?.isDeprecated}
          onClick={() => {
            const newToken = allTokens.find(
              (t) => !tokens.some((x) => x.id === t.id),
            )!
            updateInput(newToken.id, '')
            setTokens([...tokens, newToken])
          }}
        >
          <PlusIcon
            strokeWidth={3}
            className="w-4 h-4 dark:text-skyblue text-blue"
          />
          <span className="font-semibold text-blue dark:text-skyblue">
            Deposit Multiple Assets
          </span>
        </button>
      )}
      <CheckerProvider>
        <Checker.Connect fullWidth>
          <Checker.Custom
            showChildren={!pool.isDeprecated}
            buttonText="Pool Deprecated"
            disabled={pool.isDeprecated}
            onClick={() => {}}
          >
            <Checker.Network fullWidth chainId={chainId}>
              <Checker.Custom
                showChildren={!lockedUntil}
                buttonText={
                  lockDurationIsOver
                    ? `Go to Portfolio page to claim and unlock liquidity`
                    : `Locked until ${format(
                        new Date(
                          Number(
                            (
                              (lockedUntil || BigInt(0)) * BigInt(1000)
                            ).toString(),
                          ),
                        ),
                        'M/dd/yyyy h:mm a',
                      )}. Cannot deposit until it's unlocked.`
                }
                disabled={Boolean(lockedUntil)}
                onClick={() => {}}
              >
                <Checker.Custom
                  showChildren={!errorMessage}
                  buttonText={errorMessage || 'Deposit Param Error'}
                  disabled={Boolean(errorMessage)}
                  onClick={() => {}}
                >
                  <Checker.Amounts
                    fullWidth
                    chainId={chainId}
                    amounts={useMemo(() => parsedInputs, [parsedInputs])}
                  >
                    <Checker.Custom
                      showChildren={
                        !nativeToWrap ||
                        wrapNative.status === 'success' ||
                        wrappedBalance?.gt(nativeToWrap || 0) ||
                        wrappedBalance?.eq(nativeToWrap || 0)
                      }
                      buttonText={'Wrap Token'}
                      disabled={wrapNative.status === 'pending'}
                      loading={wrapNative.status === 'pending'}
                      onClick={async () => {
                        await wrapNative.write?.()
                      }}
                    >
                      <Checker.ApproveERC20Multiple
                        fullWidth
                        size="xl"
                        id="approve-erc20-multiple"
                        amounts={parsedTokenInputs.map((amount) => ({
                          amount,
                          contract: pool.address,
                        }))}
                        enabled={parsedTokenInputs.length > 0}
                        // index={parsedInputs.length - 1}
                      >
                        <Checker.Custom
                          showChildren={!simErrorMessage}
                          buttonText={simErrorMessage || 'Simulation Error'}
                          disabled={Boolean(simErrorMessage)}
                          onClick={() => {}}
                        >
                          <Checker.Success tag={APPROVE_TAG_ADD_BLADE}>
                            <Button
                              size="xl"
                              fullWidth
                              testId="add-liquidity"
                              loading={
                                (txnHash && status === 'pending') ||
                                isSimLoading ||
                                isLoadingParams
                              }
                              disabled={
                                !depositParams ||
                                isLoadingParams ||
                                (txnHash && status === 'pending') ||
                                isSimLoading ||
                                Boolean(simErrorMessage)
                              }
                              onClick={deposit}
                            >
                              Deposit
                            </Button>
                          </Checker.Success>
                        </Checker.Custom>
                      </Checker.ApproveERC20Multiple>
                    </Checker.Custom>
                  </Checker.Amounts>
                </Checker.Custom>
              </Checker.Custom>
            </Checker.Network>
          </Checker.Custom>
        </Checker.Connect>
      </CheckerProvider>
    </div>
  )
}
