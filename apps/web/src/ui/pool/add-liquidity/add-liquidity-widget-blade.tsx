import { PlusIcon } from '@heroicons/react-v1/solid'
import type { BladePool } from '@sushiswap/graph-client/data-api'
import { Button } from '@sushiswap/ui'
import { type FC, Fragment, useMemo } from 'react'
import { APPROVE_TAG_ADD_BLADE } from 'src/lib/constants'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { useBladeDepositParams } from 'src/lib/wagmi/hooks/pools/hooks/use-blade-deposit-params'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { isBladeChainId } from 'sushi/config'
import { type BladeChainId, isWNativeSupported } from 'sushi/config'
import {
  Amount,
  Token,
  type Type,
  tryParseAmount,
  unwrapToken,
} from 'sushi/currency'
import { useAccount } from 'wagmi'
import type { IDExtended } from './add-liquidity-blade'

type AddLiquidityWidgetBladeProps = {
  chainId: BladeChainId
  pool: BladePool
  tokens: Type[]
  setTokens: React.Dispatch<React.SetStateAction<Type[]>>
  maxTokens: number
  inputs: Record<IDExtended, string>
  updateInput: (
    tokenId: IDExtended,
    value: string,
    removeToken?: boolean,
  ) => void
  independendField: number
  setIndependendField: React.Dispatch<React.SetStateAction<number>>
  replaceTokenAt: (index: number, token?: Type) => void
  removeTokenAt: (index: number) => void
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
  const {
    data: depositParams,
    error,
    isLoading: isLoadingParams,
  } = useBladeDepositParams({
    sender: address,
    poolAddress: pool.address,
    chainId,
    tokens,
    inputs,
  })

  const parsedInputs = useMemo(() => {
    return tokens.map((token) => {
      const value = inputs[token.id] ?? ''
      return tryParseAmount(value, token) || Amount.fromRawAmount(token, 0)
    })
  }, [tokens, inputs])

  const allTokens = useMemo(() => {
    return pool.tokens.map((token) =>
      unwrapToken(
        new Token({
          chainId: token.chainId,
          address: token?.address,
          decimals: token?.decimals,
          symbol: token.symbol,
          name: token?.name,
        }),
      ),
    )
  }, [pool])

  const currencies = useMemo(() => {
    return allTokens
      .filter((i) => !tokens.some((x) => x.id === i.id))
      .reduce<Record<string, Type>>((acc, cur) => {
        acc[cur.wrapped.address] = cur
        return acc
      }, {})
  }, [allTokens, tokens])

  const renderTokenRow = (t: Type, i: number) => {
    const value = inputs[t.id] ?? ''

    const onChange = (v: string) => updateInput(t.id, v)

    const onSelect = (next?: Type) => replaceTokenAt(i, next)

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
              <Checker.Amounts
                fullWidth
                chainId={chainId}
                amounts={useMemo(() => parsedInputs, [parsedInputs])}
              >
                <Checker.Custom
                  showChildren={!error?.message}
                  buttonText={error?.message || ''}
                  disabled={Boolean(error?.message)}
                  onClick={() => {}}
                >
                  {(!pool || isBladeChainId(pool.chainId)) &&
                    tokens.map((token, i) => {
                      const value = inputs[token.id] ?? ''
                      const parsedInput =
                        tryParseAmount(value, token) ||
                        Amount.fromRawAmount(token, 0)

                      return (
                        <Checker.ApproveERC20
                          key={`${token.wrapped.address}-${i}-approve`}
                          id="approve-token-1"
                          className="whitespace-nowrap"
                          fullWidth
                          disabled={!depositParams || isLoadingParams}
                          amount={parsedInput}
                          contract={pool.address}
                        >
                          <Checker.Success tag={APPROVE_TAG_ADD_BLADE}>
                            {/* AddSectionReviewModalLegacy was wrapping here */}
                            {i === 0 ? ( // Only show button on first token row}
                              <Button
                                size="xl"
                                fullWidth
                                testId="add-liquidity"
                                disabled={isLoadingParams}
                              >
                                Deposit
                              </Button>
                            ) : null}
                          </Checker.Success>
                        </Checker.ApproveERC20>
                      )
                    })}
                </Checker.Custom>
              </Checker.Amounts>
            </Checker.Network>
          </Checker.Custom>
        </Checker.Connect>
      </CheckerProvider>
    </div>
  )
}
