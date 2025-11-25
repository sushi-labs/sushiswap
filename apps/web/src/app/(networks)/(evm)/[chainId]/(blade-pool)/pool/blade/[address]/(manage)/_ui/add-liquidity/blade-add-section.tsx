'use client'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { Button } from '@sushiswap/ui'
import { type FC, useCallback, useMemo, useState } from 'react'
import { APPROVE_TAG_ADD_LEGACY } from 'src/lib/constants'
import { useBladeAllowDeposit } from 'src/lib/pool/blade/useBladeAllowDeposit'
import { useUnlockDeposit } from 'src/lib/pool/blade/useUnlockDeposit'
import { getPoolAssets } from 'src/lib/pool/blade/utils'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { CheckerProvider } from 'src/lib/wagmi/systems/Checker/provider'
import { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { useConnection } from 'wagmi'
import { useBladePoolPosition } from '../blade-pool-position-provider'
import {
  BladeAddLiquidityReviewModal,
  BladeAddLiquidityReviewModalTrigger,
} from './blade-add-liquidity-review-modal'
import { BladeAddSectionWidget } from './blade-add-section-widget'

interface TokenInput {
  token: EvmCurrency | undefined
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
  const { address } = useConnection()
  const { vestingDeposit, refetch: refetchPosition } = useBladePoolPosition()

  const hasLockedPosition = useMemo(() => {
    return Boolean(vestingDeposit?.balance && vestingDeposit.balance > 0n)
  }, [vestingDeposit?.balance])

  const canUnlockPosition = useMemo(() => {
    if (!vestingDeposit?.balance || !vestingDeposit.lockedUntil) return false
    return (
      vestingDeposit.balance > 0n && new Date() >= vestingDeposit.lockedUntil
    )
  }, [vestingDeposit?.balance, vestingDeposit?.lockedUntil])

  const { write: unlockDeposit, isPending: isUnlockingDeposit } =
    useUnlockDeposit({
      pool,
      enabled: canUnlockPosition,
      onSuccess: () => {
        refetchPosition()
      },
    })

  const [inputs, setInputs] = useState<TokenInput[]>([
    { token: undefined, amount: '' },
  ])

  const parsedInputs = useMemo(() => {
    return inputs
      .map((input) =>
        input.token
          ? Amount.tryFromHuman(input.token, input.amount)
          : undefined,
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

  const onSelectToken = useCallback((index: number, currency: EvmCurrency) => {
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
    const map = new Map<EvmCurrency, string>()
    for (const input of inputs) {
      if (input.token && input.amount) {
        map.set(input.token, input.amount)
      }
    }
    return map
  }, [inputs])

  const validInputs = useMemo(() => {
    return inputs.filter((input) => input.token && input.amount) as Array<{
      token: EvmCurrency
      amount: string
    }>
  }, [inputs])

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
                          const parsedAmount = Amount.tryFromHuman(
                            token,
                            amount,
                          )
                          if (!parsedAmount) return acc
                          const wrappedToken = token.wrap()
                          const approveChecker = (
                            <Checker.ApproveERC20
                              key={wrappedToken.address}
                              fullWidth
                              id={`approve-token-${wrappedToken.address}`}
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
                            <Checker.CustomWithTooltip
                              showChildren={!hasLockedPosition}
                              onClick={unlockDeposit!}
                              buttonText={
                                canUnlockPosition
                                  ? 'Unlock Position'
                                  : 'Wait for position to unlock'
                              }
                              loading={isUnlockingDeposit}
                              disabled={
                                !canUnlockPosition ||
                                !unlockDeposit ||
                                isUnlockingDeposit
                              }
                              fullWidth
                              tooltipTitle="Unlock Blade Position"
                              tooltipDescription={`Your position is currently locked and must be unlocked before you can add additional liquidity. ${
                                canUnlockPosition
                                  ? 'Click to unlock your position and then proceed with adding liquidity.'
                                  : 'Please wait until the lock period expires before unlocking.'
                              }`}
                            >
                              <BladeAddLiquidityReviewModalTrigger>
                                <Button
                                  size="xl"
                                  fullWidth
                                  disabled={validInputs.length === 0}
                                >
                                  Add Liquidity
                                </Button>
                              </BladeAddLiquidityReviewModalTrigger>
                            </Checker.CustomWithTooltip>
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
