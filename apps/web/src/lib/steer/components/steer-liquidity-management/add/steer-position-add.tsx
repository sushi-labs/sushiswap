'use client'

import { PlusIcon } from '@heroicons/react/24/solid'
import { Button, DialogTrigger, classNames } from '@sushiswap/ui'
import React, { type FC, useMemo } from 'react'

import type { VaultV1 } from '@sushiswap/graph-client/data-api'
import { useIsMounted } from '@sushiswap/hooks'
import { APPROVE_TAG_ADD_STEER, Field } from 'src/lib/constants'
import { STEER_PERIPHERY_ADDRESS } from 'src/lib/steer/config'
import { Web3Input } from 'src/lib/wagmi/components/web3-input'
import { Amounts } from 'src/lib/wagmi/systems/checker/amounts'
import { ApproveERC20 } from 'src/lib/wagmi/systems/checker/approve-erc20'
import { Connect } from 'src/lib/wagmi/systems/checker/connect'
import { Guard } from 'src/lib/wagmi/systems/checker/guard'
import { Network } from 'src/lib/wagmi/systems/checker/network'
import { CheckerProvider } from 'src/lib/wagmi/systems/checker/provider'
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
    return Object.values(parsedAmounts)
  }, [parsedAmounts])

  return (
    <CheckerProvider>
      <div
        className={classNames(
          isLoading ? 'opacity-40 pointer-events-none' : '',
          'flex flex-col gap-4',
        )}
      >
        <div className="relative">
          <Web3Input.Currency
            id="add-liquidity-token0"
            type="INPUT"
            className="p-3 bg-white dark:bg-secondary rounded-xl border border-accent"
            chainId={vault.chainId}
            value={formattedAmounts[Field.CURRENCY_A]}
            onChange={onFieldAInput}
            currency={currencies?.CURRENCY_A}
            loading={isLoading}
          />
        </div>
        <div className="flex items-center justify-center mt-[-24px] mb-[-24px] z-10">
          <div className="p-1 bg-white dark:bg-slate-900 border border-accent rounded-full">
            <PlusIcon
              width={16}
              height={16}
              className="text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative">
          <Web3Input.Currency
            id="add-liquidity-token1"
            type="INPUT"
            className="p-3 bg-white dark:bg-secondary rounded-xl border border-accent"
            chainId={vault.chainId}
            value={formattedAmounts[Field.CURRENCY_B]}
            onChange={onFieldBInput}
            currency={currencies?.CURRENCY_B}
            loading={isLoading}
          />
        </div>

        {isMounted ? (
          <Guard guardWhen={vault.isDeprecated} guardText="Vault is deprecated">
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
                    amount={parsedAmounts?.[Field.CURRENCY_A]}
                    contract={STEER_PERIPHERY_ADDRESS[vault.chainId]}
                  >
                    <ApproveERC20
                      fullWidth
                      id="approve-erc20-1"
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
        ) : (
          <Button fullWidth size="xl">
            Connect
          </Button>
        )}
      </div>
    </CheckerProvider>
  )
}
