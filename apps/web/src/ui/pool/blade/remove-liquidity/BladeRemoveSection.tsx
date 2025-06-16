'use client'

import { useDebounce } from '@sushiswap/hooks'
import { createToast } from '@sushiswap/notifications'
import { Button, Dots } from '@sushiswap/ui'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { bladeCommonExchangeAbi } from 'src/lib/pool/blade/abi/bladeCommonExchange'
import { getPoolAssets } from 'src/lib/pool/blade/utils'
import { Amount, type Type } from 'sushi/currency'
import { Percent } from 'sushi/math'
import { type SendTransactionReturnType, encodeFunctionData } from 'viem'

import type { BladePool } from '@sushiswap/graph-client/data-api'
import { useTotalSupply } from 'src/lib/wagmi/hooks/tokens/useTotalSupply'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { withCheckerRoot } from 'src/lib/wagmi/systems/Checker/Provider'
import type { BladeChainId } from 'sushi/config'
import {
  type UseCallParameters,
  useAccount,
  useCall,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { useBladePoolPosition } from '../BladePoolPositionProvider'
import { BladeRemoveSectionWidget } from './BladeRemoveSectionWidget'

interface BladeRemoveSectionProps {
  pool: BladePool
}

export const BladeRemoveSection: FC<BladeRemoveSectionProps> = withCheckerRoot(
  ({ pool }) => {
    const poolAssets = useMemo(
      () => getPoolAssets(pool).filter((asset) => asset.targetWeight > 0),
      [pool],
    )
    const client = usePublicClient()
    const { address, chain } = useAccount()

    const [percentage, setPercentage] = useState<string>('0')
    const percentToRemove = useMemo(
      () => new Percent(percentage, 100),
      [percentage],
    )
    const percentToRemoveDebounced = useDebounce(percentToRemove, 300)

    const { balance, liquidityToken } = useBladePoolPosition()
    const poolTotalSupply = useTotalSupply(liquidityToken)

    const userPositionValue = useMemo(() => {
      if (
        !balance?.quotient ||
        !poolTotalSupply?.quotient ||
        poolTotalSupply.quotient === 0n
      ) {
        return 0
      }

      const poolProportion =
        Number(balance.quotient) / Number(poolTotalSupply.quotient)
      return pool.liquidityUSD * poolProportion
    }, [balance, poolTotalSupply, pool.liquidityUSD])

    const amountToRemove = useMemo(() => {
      return balance &&
        percentToRemoveDebounced &&
        percentToRemoveDebounced.greaterThan('0')
        ? Amount.fromRawAmount(
            balance.currency,
            percentToRemoveDebounced.multiply(balance.quotient).quotient,
          )
        : undefined
    }, [balance, percentToRemoveDebounced])

    const tokensToReceive = useMemo(() => {
      if (!poolAssets || !userPositionValue || userPositionValue === 0) {
        return []
      }

      return poolAssets
        .filter((asset) => 'token' in asset && asset.token)
        .map((asset) => {
          if ('token' in asset) {
            const userAssetValue = userPositionValue * asset.weight
            const amountToReceiveValue =
              userAssetValue * (Number(percentage) / 100)

            return {
              usdValue: amountToReceiveValue,
              currency: asset.token,
            }
          }
          return null
        })
        .filter(Boolean) as Array<{ usdValue: number; currency: Type }>
    }, [poolAssets, userPositionValue, percentage])

    const { refetchChain: refetchBalances } = useRefetchBalances()

    const onSuccess = useCallback(
      (hash: SendTransactionReturnType) => {
        setPercentage('0')

        if (!chain?.id) return

        const receipt = client.waitForTransactionReceipt({ hash })
        receipt.then(() => {
          refetchBalances(chain.id)
        })

        const ts = new Date().getTime()
        void createToast({
          account: address,
          type: 'burn',
          chainId: chain.id,
          txHash: hash,
          promise: receipt,
          summary: {
            pending: `Removing liquidity from the Blade pool`,
            completed: `Successfully removed liquidity from the Blade pool`,
            failed: 'Something went wrong when removing liquidity',
          },
          timestamp: ts,
          groupTimestamp: ts,
        })
      },
      [refetchBalances, client, chain, address],
    )

    const [prepare, setPrepare] = useState<UseCallParameters | undefined>(
      undefined,
    )

    useEffect(() => {
      const prep = async () => {
        if (
          !chain?.id ||
          !address ||
          !amountToRemove ||
          Number(percentage) === 0 ||
          !pool.address
        ) {
          return
        }

        try {
          const data = encodeFunctionData({
            abi: bladeCommonExchangeAbi,
            functionName: 'burnToWithdraw',
            args: [amountToRemove.quotient],
          })

          return {
            account: address,
            to: pool.address as `0x${string}`,
            data,
          } satisfies UseCallParameters
        } catch (error) {
          console.error('Error preparing burnToWithdraw call:', error)
          return undefined
        }
      }

      prep()
        .then((config) => {
          setPrepare(config)
        })
        .catch((e) => {
          console.error('remove prepare error', e)
        })
    }, [chain?.id, address, amountToRemove, percentage, pool.address])

    const { isError: isSimulationError } = useCall({
      ...prepare,
      chainId: pool.chainId,
      query: {
        enabled: Boolean(Number(percentage) > 0),
      },
    })

    const { sendTransactionAsync, isPending: isWritePending } =
      useSendTransaction({
        mutation: {
          onSuccess,
        },
      })

    const send = useMemo(() => {
      if (!prepare || isSimulationError) return undefined

      return async () => {
        try {
          await sendTransactionAsync(prepare as any)
        } catch (error) {
          console.error('Transaction failed:', error)
        }
      }
    }, [isSimulationError, prepare, sendTransactionAsync])

    return (
      <div>
        <BladeRemoveSectionWidget
          chainId={pool.chainId}
          percentage={percentage}
          tokensMinimum={tokensToReceive}
          setPercentage={setPercentage}
        >
          <Checker.Connect fullWidth>
            <Checker.Network fullWidth chainId={pool.chainId}>
              <Checker.Guard
                fullWidth
                guardWhen={+percentage <= 0}
                guardText="Enter amount"
              >
                <Button
                  size="xl"
                  fullWidth
                  onClick={() => send?.()}
                  disabled={isWritePending || !send}
                  testId="remove-liquidity"
                >
                  {isWritePending ? (
                    <Dots>Confirm transaction</Dots>
                  ) : (
                    'Remove Liquidity'
                  )}
                </Button>
              </Checker.Guard>
            </Checker.Network>
          </Checker.Connect>
        </BladeRemoveSectionWidget>
      </div>
    )
  },
)
