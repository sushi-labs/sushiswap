'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { type FC, useCallback, useMemo, useState } from 'react'
import { APPROVE_TAG_ADD_LEGACY } from 'src/lib/constants'
import { useBladeAllowDeposit } from 'src/lib/pool/blade/useBladeDeposit'
import { getPoolAssets } from 'src/lib/pool/blade/utils'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/Provider'
import { type Type, tryParseAmount } from 'sushi/currency'
import { useAccount } from 'wagmi'
import {
  BladeAddLiquidityReviewModal,
  BladeAddLiquidityReviewModalTrigger,
} from './BladeAddLiquidityReviewModal'
import { BladeAddSectionWidget } from './BladeAddSectionWidget'

interface TokenInput {
  token: Type | undefined
  amount: string
}
export const BladeAddSection: FC<{ pool: BladePool }> = ({ pool }) => {
  const availableTokens = useMemo(() => {
    const assets = getPoolAssets(pool, { showStableTypes: true })
    return assets.flatMap((asset) => {
      if (asset.targetWeight === 0 || !('token' in asset)) return []
      return [asset.token]
    })
  }, [pool])

  const chainId = pool.chainId
  const isMounted = useIsMounted()
  const { address } = useAccount()

  const [inputs, setInputs] = useState<TokenInput[]>([
    { token: undefined, amount: '' },
  ])

  const parsedInputs = useMemo(() => {
    return inputs
      .map((input) =>
        input.token ? tryParseAmount(input.amount, input.token) : undefined,
      )
      .filter(Boolean)
  }, [inputs])

  const { data: depositPermission, isLoading: isLoadingPermission } =
    useBladeAllowDeposit({
      chainId,
      poolAddress: pool.address,
      enabled: Boolean(address),
    })

  const onChangeTypedAmount = useCallback((index: number, value: string) => {
    setInputs((prev) => {
      const newInputs = [...prev]
      newInputs[index] = { ...newInputs[index], amount: value }
      return newInputs
    })
  }, [])

  const onSelectToken = useCallback((index: number, currency: Type) => {
    setInputs((prev) => {
      const newInputs = [...prev]
      newInputs[index] = { ...newInputs[index], token: currency }
      return newInputs
    })
  }, [])

  const onAddToken = useCallback(() => {
    setInputs((prev) => [...prev, { token: undefined, amount: '' }])
  }, [])

  const onRemoveToken = useCallback(
    (index: number) => {
      if (inputs.length <= 1) return

      setInputs((prev) => prev.filter((_, i) => i !== index))
    },
    [inputs.length],
  )

  const validInputMap = useMemo(() => {
    const map = new Map<Type, string>()
    for (const input of inputs) {
      if (input.token && input.amount) {
        map.set(input.token, input.amount)
      }
    }
    return map
  }, [inputs])

  const validInputs = useMemo(() => {
    return inputs.filter((input) => input.token && input.amount) as Array<{
      token: Type
      amount: string
    }>
  }, [inputs])

  // TODO-BLADE: Handle scenario where user is not allowed to deposit
  const userAllowed = depositPermission?.allow ?? false

  return (
    <CheckerProvider>
      <BladeAddSectionWidget
        chainId={chainId}
        availableTokens={availableTokens}
        inputs={inputs}
        onInput={onChangeTypedAmount}
        onSelectToken={onSelectToken}
        onAddToken={onAddToken}
        onRemoveToken={onRemoveToken}
      >
        <Checker.Connect fullWidth>
          <Checker.Guard
            fullWidth
            guardWhen={isMounted && availableTokens.length === 0}
            guardText="No tokens found in pool"
          >
            <Checker.Guard
              fullWidth
              guardWhen={isLoadingPermission}
              guardText="Checking deposit permission..."
            >
              <Checker.Guard
                fullWidth
                guardWhen={!userAllowed}
                guardText="Deposits not allowed for this account"
              >
                <BladeAddLiquidityReviewModal
                  pool={pool}
                  chainId={chainId}
                  validInputs={validInputs}
                  depositPermission={depositPermission}
                  onSuccess={() => {
                    setInputs([{ token: undefined, amount: '' }])
                  }}
                >
                  <Checker.Network fullWidth chainId={chainId}>
                    <Checker.Amounts
                      fullWidth
                      chainId={chainId}
                      amounts={parsedInputs}
                    >
                      {Array.from(validInputMap.entries()).reduce(
                        (acc, [token, amount]) => {
                          const parsedAmount = tryParseAmount(amount, token)
                          if (!parsedAmount) return acc

                          const approveChecker = (
                            <Checker.ApproveERC20
                              key={token.wrapped.address}
                              fullWidth
                              id={`approve-token-${token.wrapped.address}`}
                              className="whitespace-nowrap"
                              amount={parsedAmount}
                              contract={pool.address}
                            >
                              {acc}
                            </Checker.ApproveERC20>
                          )
                          return approveChecker
                        },
                        (
                          <Checker.Success tag={APPROVE_TAG_ADD_LEGACY}>
                            <BladeAddLiquidityReviewModalTrigger>
                              <Button
                                size="xl"
                                fullWidth
                                disabled={validInputs.length === 0}
                              >
                                Add Liquidity
                              </Button>
                            </BladeAddLiquidityReviewModalTrigger>
                          </Checker.Success>
                        ) as React.ReactNode,
                      )}
                    </Checker.Amounts>
                  </Checker.Network>
                </BladeAddLiquidityReviewModal>
              </Checker.Guard>
            </Checker.Guard>
          </Checker.Guard>
        </Checker.Connect>
      </BladeAddSectionWidget>
    </CheckerProvider>
  )
}
