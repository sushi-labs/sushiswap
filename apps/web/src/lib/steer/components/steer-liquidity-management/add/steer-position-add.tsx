'use client'

import { Button, DialogTrigger, classNames } from '@sushiswap/ui'
import React, { type FC, useMemo } from 'react'

import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import {
  LiquidityDepositDivider,
  LiquidityDepositInput,
} from 'src/lib/components/liquidity-deposit-input'
import { APPROVE_TAG_ADD_STEER, Field } from 'src/lib/constants'
import { STEER_PERIPHERY_ADDRESS } from 'src/lib/steer/config'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { ApproveERC20 } from 'src/lib/wagmi/systems/checker/approve-erc20'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Guard } from 'src/lib/wagmi/systems/checker/guard'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { CheckerProvider } from 'src/lib/wagmi/systems/checker/provider'
import { StockTokenRegion } from 'src/lib/wagmi/systems/checker/stock-token-region'
import { Success } from 'src/lib/wagmi/systems/checker/success'
import {
  useSteerPositionAddActions,
  useSteerPositionAddDerivedInfo,
  useSteerPositionAddState,
} from './steer-position-add-provider'
import { SteerPositionAddReviewModal } from './steer-position-add-review-modal'

interface SteerPositionAddProps {
  vault: VaultV1
}

export const SteerPositionAdd: FC<SteerPositionAddProps> = ({ vault }) => {
  const isMounted = useIsMounted()

  const {
    currencies,
    independentField,
    dependentField,
    parsedAmounts,
    depositADisabled,
    depositBDisabled,
    isLoading,
  } = useSteerPositionAddDerivedInfo({
    vault,
  })
  const { onFieldAInput, onFieldBInput } = useSteerPositionAddActions()
  const { typedValue } = useSteerPositionAddState()

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts?.[dependentField].toSignificant(6) ?? '',
  }

  const amounts = useMemo(() => {
    if (!parsedAmounts) return [undefined, undefined]
    const amounts = []
    if (!depositADisabled) amounts.push(parsedAmounts[Field.CURRENCY_A])
    if (!depositBDisabled) amounts.push(parsedAmounts[Field.CURRENCY_B])
    return amounts
  }, [parsedAmounts, depositADisabled, depositBDisabled])

  return (
    <CheckerProvider>
      <div
        className={classNames(
          isLoading ? 'opacity-40 pointer-events-none' : '',
          'flex flex-col gap-4',
        )}
      >
        <LiquidityDepositInput
          id="add-liquidity-token0"
          chainId={vault.chainId}
          value={formattedAmounts[Field.CURRENCY_A]}
          onChange={onFieldAInput}
          currency={currencies?.CURRENCY_A}
          loading={isLoading}
          locked={depositADisabled}
        />
        <LiquidityDepositDivider />
        <LiquidityDepositInput
          id="add-liquidity-token1"
          chainId={vault.chainId}
          value={formattedAmounts[Field.CURRENCY_B]}
          onChange={onFieldBInput}
          currency={currencies?.CURRENCY_B}
          loading={isLoading}
          locked={depositBDisabled}
        />

        {isMounted ? (
          <StockTokenRegion
            token0={currencies?.CURRENCY_A}
            token1={currencies?.CURRENCY_B}
          >
            <Guard
              guardWhen={vault.isDeprecated}
              guardText="Vault is deprecated"
            >
              <Connect testId="connect" fullWidth>
                <Network
                  testId="switch-network"
                  fullWidth
                  chainId={vault.chainId}
                >
                  <Amounts
                    testId="check-amounts"
                    fullWidth
                    chainId={vault.chainId}
                    amounts={amounts}
                  >
                    <ApproveERC20
                      fullWidth
                      id="approve-erc20-0"
                      enabled={!depositADisabled}
                      amount={parsedAmounts?.[Field.CURRENCY_A]}
                      contract={STEER_PERIPHERY_ADDRESS[vault.chainId]}
                    >
                      <ApproveERC20
                        fullWidth
                        id="approve-erc20-1"
                        enabled={!depositBDisabled}
                        amount={parsedAmounts?.[Field.CURRENCY_B]}
                        contract={STEER_PERIPHERY_ADDRESS[vault.chainId]}
                      >
                        <Success tag={APPROVE_TAG_ADD_STEER}>
                          <SteerPositionAddReviewModal
                            vault={vault}
                            onSuccess={() => {
                              onFieldAInput('')
                              onFieldBInput('')
                            }}
                            // successLink={successLink}
                          >
                            <DialogTrigger asChild>
                              <Button
                                fullWidth
                                size="xl"
                                testId="add-steer-liquidity-preview"
                              >
                                Preview
                              </Button>
                            </DialogTrigger>
                          </SteerPositionAddReviewModal>
                        </Success>
                      </ApproveERC20>
                    </ApproveERC20>
                  </Amounts>
                </Network>
              </Connect>
            </Guard>
          </StockTokenRegion>
        ) : (
          <Button fullWidth size="xl">
            Connect
          </Button>
        )}
      </div>
    </CheckerProvider>
  )
}
