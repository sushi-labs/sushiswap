'use client'

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { SlippageToleranceStorageKey, TTLStorageKey } from '@sushiswap/hooks'
import {
  Button,
  DialogTrigger,
  FormSection,
  Message,
  SettingsModule,
  SettingsOverlay,
  classNames,
} from '@sushiswap/ui'
import { type ReactElement, useCallback, useMemo } from 'react'
import {
  LiquidityDepositDivider,
  LiquidityDepositInput,
} from 'src/lib/components/liquidity-deposit-input'
import { Bound, Field } from 'src/lib/constants'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import { getV4MintMaxAmounts, isV4NativeCurrencyEnabled } from 'src/lib/pool/v4'
import { getPermit2TokenAmounts } from 'src/lib/wagmi/hooks/approvals/hooks/use-permit2-permit-batch'
import { useTransactionDeadline } from 'src/lib/wagmi/hooks/utils/hooks/use-transaction-deadline'
import { Checker } from 'src/lib/wagmi/systems/checker'
import {
  type EvmCurrency,
  PERMIT2_ADDRESS,
  type SushiSwapV4ChainId,
} from 'sushi/evm'
import {
  useConcentratedMintActionHandlers,
  useConcentratedMintState,
} from '~evm/[chainId]/_ui/concentrated-liquidity-provider'
import { ExtremeTickWarning } from '~evm/[chainId]/_ui/extreme-tick-warning'
import type { V4DerivedMintInfo } from './use-v4-derived-mint-info'
import { V4AddLiquidityReviewModal } from './v4-add-liquidity-review-modal'

interface V4LiquidityWidgetProps {
  chainId: SushiSwapV4ChainId
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  setCurrencyA?(currency: EvmCurrency): void
  setCurrencyB?(currency: EvmCurrency): void
  derived: V4DerivedMintInfo
  /** Increases this position; mints a new one when unset. */
  tokenId?: bigint
  successLink?: string
  withTitleAndDescription?: boolean
}

export function V4LiquidityWidget({
  chainId,
  currencyA,
  currencyB,
  setCurrencyA,
  setCurrencyB,
  derived,
  tokenId,
  successLink,
  withTitleAndDescription = true,
}: V4LiquidityWidgetProps): ReactElement {
  const {
    outOfRange,
    invalidRange,
    invalidPrice,
    dependentField,
    parsedAmounts,
    depositADisabled,
    depositBDisabled,
    ticks,
    position,
    pool,
    poolForPosition,
    isLoading,
  } = derived

  const [slippageTolerance] = useSlippageTolerance(
    SlippageToleranceStorageKey.AddLiquidity,
  )
  const { data: deadline } = useTransactionDeadline({
    storageKey: TTLStorageKey.AddLiquidity,
    chainId,
  })
  const { onFieldAInput, onFieldBInput } = useConcentratedMintActionHandlers()
  const { independentField, typedValue } = useConcentratedMintState()

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const onSuccess = useCallback(() => {
    onFieldAInput('')
    onFieldBInput('')
  }, [onFieldAInput, onFieldBInput])

  const amounts = useMemo(() => {
    const amounts = []
    if (!depositADisabled) amounts.push(parsedAmounts[Field.CURRENCY_A])
    if (!depositBDisabled) amounts.push(parsedAmounts[Field.CURRENCY_B])
    return amounts
  }, [depositADisabled, depositBDisabled, parsedAmounts])

  const maxAmounts = useMemo(
    () => (position ? getV4MintMaxAmounts(position, slippageTolerance) : []),
    [position, slippageTolerance],
  )
  // The position manager pulls tokens through Permit2, which needs approving
  const permit2Approvals = useMemo(
    () =>
      getPermit2TokenAmounts(maxAmounts).map((amount) => ({
        amount,
        contract: PERMIT2_ADDRESS,
      })),
    [maxAmounts],
  )

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const disabled =
    !isLoading &&
    (tickLower === undefined ||
      tickUpper === undefined ||
      invalidRange ||
      !poolForPosition)

  const widget = (
    <div className="flex flex-col gap-4">
      {outOfRange ? (
        <Message size="sm" variant="warning">
          Your position will not earn fees or be used in trades until the market
          price moves into your range.
        </Message>
      ) : null}
      {invalidRange ? (
        <Message size="sm" variant="warning">
          Invalid range selected. The minimum price must be lower than the
          maximum price.
        </Message>
      ) : null}
      {invalidPrice ? (
        <Message size="sm" variant="warning">
          The starting price is outside the range the protocol supports.
        </Message>
      ) : null}
      <ExtremeTickWarning tickCurrent={pool?.tickCurrent} />
      <div
        className={classNames(
          disabled ? 'opacity-40 pointer-events-none' : '',
          'flex flex-col gap-4',
        )}
      >
        <LiquidityDepositInput
          locked={depositADisabled && !depositBDisabled}
          id="add-liquidity-token0"
          chainId={chainId}
          value={formattedAmounts[Field.CURRENCY_A]}
          onChange={onFieldAInput}
          onSelect={setCurrencyA}
          currency={currencyA}
          disabled={depositADisabled}
          loading={isLoading}
          allowNative={isV4NativeCurrencyEnabled(chainId)}
        />
        <LiquidityDepositDivider />
        <LiquidityDepositInput
          locked={depositBDisabled && !depositADisabled}
          id="add-liquidity-token1"
          chainId={chainId}
          value={formattedAmounts[Field.CURRENCY_B]}
          onChange={onFieldBInput}
          onSelect={setCurrencyB}
          currency={currencyB}
          disabled={depositBDisabled}
          loading={isLoading}
          allowNative={isV4NativeCurrencyEnabled(chainId)}
        />
        <Checker.Root>
          {/* Only the trigger is gated, so the dialog outlives the inputs
              clearing once the transaction is sent */}
          <V4AddLiquidityReviewModal
            chainId={chainId}
            currencyA={currencyA}
            currencyB={currencyB}
            inputA={
              depositADisabled ? undefined : parsedAmounts[Field.CURRENCY_A]
            }
            inputB={
              depositBDisabled ? undefined : parsedAmounts[Field.CURRENCY_B]
            }
            derived={derived}
            maxAmounts={maxAmounts}
            deadline={deadline}
            slippageTolerance={slippageTolerance}
            tokenId={tokenId}
            successLink={successLink}
            onSuccess={onSuccess}
          >
            <Checker.StockTokenRegion token0={currencyA} token1={currencyB}>
              <Checker.Connect namespace="evm" fullWidth>
                <Checker.Network fullWidth chainId={chainId}>
                  <Checker.Amounts
                    fullWidth
                    chainId={chainId}
                    amounts={amounts}
                  >
                    <Checker.Slippage
                      fullWidth
                      slippageTolerance={slippageTolerance}
                      text="Continue With High Slippage"
                    >
                      <Checker.ApproveERC20Multiple
                        fullWidth
                        id="approve-permit2"
                        amounts={permit2Approvals}
                      >
                        <DialogTrigger asChild>
                          <Button
                            fullWidth
                            size="xl"
                            disabled={!position || position.liquidity === 0n}
                            testId="add-liquidity-preview"
                          >
                            Preview
                          </Button>
                        </DialogTrigger>
                      </Checker.ApproveERC20Multiple>
                    </Checker.Slippage>
                  </Checker.Amounts>
                </Checker.Network>
              </Checker.Connect>
            </Checker.StockTokenRegion>
          </V4AddLiquidityReviewModal>
        </Checker.Root>
      </div>
    </div>
  )

  if (!withTitleAndDescription) return widget

  return (
    <FormSection
      title="Liquidity"
      description={
        <div className="flex flex-col gap-2">
          <span>
            Depending on your range, the supplied tokens for this position will
            not always be a 50:50 ratio.
          </span>
          <V4AddLiquiditySettings />
        </div>
      }
    >
      {widget}
    </FormSection>
  )
}

/** The add liquidity slippage setting, as a button opening it. */
export function V4AddLiquiditySettings(): ReactElement {
  return (
    <SettingsOverlay
      options={{
        slippageTolerance: {
          storageKey: SlippageToleranceStorageKey.AddLiquidity,
          title: 'Add Liquidity Slippage',
        },
      }}
      modules={[SettingsModule.SlippageTolerance]}
    >
      <div>
        <Button
          size="sm"
          name="Settings"
          icon={Cog6ToothIcon}
          variant="secondary"
        >
          Settings
        </Button>
      </div>
    </SettingsOverlay>
  )
}
