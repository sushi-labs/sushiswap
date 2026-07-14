'use client'

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LinkInternal,
} from '@sushiswap/ui'
import { CheckMarkIcon } from '@sushiswap/ui/icons/CheckMarkIcon'
import { type ReactElement, useMemo, useState } from 'react'
import { Checker } from 'src/lib/wagmi/systems/Checker'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import {
  StellarChainId,
  type StellarContractAddress,
  type StellarToken,
} from 'sushi/stellar'
import { useCreateAndInitializePool } from '~stellar/_common/lib/hooks/factory/use-create-and-initialize-pool'
import { useAddLiquidity } from '~stellar/_common/lib/hooks/liquidity/use-add-liquidity'
import { getStellarTxnLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { Trustlines } from '~stellar/_common/ui/checker/trustline'
import { useStellarWallet } from '~stellar/providers'

type CreatePoolState = 'idle' | 'creating' | 'adding_liquidity'

type PairedAmountStatus =
  | 'idle'
  | 'below-range'
  | 'above-range'
  | 'within-range'
  | 'error'

interface StellarAddPoolSubmitWidgetProps {
  orderedToken0: StellarToken | undefined
  orderedToken1: StellarToken | undefined
  selectedFee: number
  existingPoolAddress: StellarContractAddress | null | undefined
  poolInitialized: boolean | undefined
  orderedToken0Amount: string
  orderedToken1Amount: string
  pairedAmountStatus: PairedAmountStatus
  initSqrtPriceX96: bigint | undefined
  isTickRangeValid: boolean
  tickLower: number
  tickUpper: number
  ticksAligned: boolean
  onLiquidityAdded(): void
}

interface SuccessfulAdd {
  poolAddress: StellarContractAddress
  txHash: string
}

export function StellarAddPoolSubmitWidget({
  orderedToken0,
  orderedToken1,
  selectedFee,
  existingPoolAddress,
  poolInitialized,
  orderedToken0Amount,
  orderedToken1Amount,
  pairedAmountStatus,
  initSqrtPriceX96,
  isTickRangeValid,
  tickLower,
  tickUpper,
  ticksAligned,
  onLiquidityAdded,
}: StellarAddPoolSubmitWidgetProps): ReactElement {
  const connectedAddress = useAccount('stellar')
  const { signTransaction, signAuthEntry } = useStellarWallet()
  const createAndInitializePoolMutation = useCreateAndInitializePool()
  const addLiquidityMutation = useAddLiquidity()
  const [createPoolState, setCreatePoolState] =
    useState<CreatePoolState>('idle')
  const [successfulAdd, setSuccessfulAdd] = useState<SuccessfulAdd>()
  const isAboveRange = pairedAmountStatus === 'above-range'
  const hasPairedAmount = Boolean(
    pairedAmountStatus === 'below-range' ||
      (pairedAmountStatus === 'within-range' &&
        orderedToken1Amount &&
        Number.parseFloat(orderedToken1Amount) > 0),
  )
  const sameTokenSelected = Boolean(
    orderedToken0 &&
      orderedToken1 &&
      orderedToken0.address === orderedToken1.address,
  )

  const checkerAmounts = useMemo(() => {
    const amounts = [
      orderedToken0
        ? Amount.tryFromHuman(orderedToken0, orderedToken0Amount)
        : undefined,
    ]

    if (
      pairedAmountStatus === 'within-range' &&
      Number.parseFloat(orderedToken1Amount) > 0
    ) {
      amounts.push(
        orderedToken1
          ? Amount.tryFromHuman(orderedToken1, orderedToken1Amount)
          : undefined,
      )
    }

    return amounts
  }, [
    orderedToken0,
    orderedToken0Amount,
    orderedToken1,
    orderedToken1Amount,
    pairedAmountStatus,
  ])

  const pendingText = useMemo((): string => {
    switch (createPoolState) {
      case 'adding_liquidity':
        return 'Adding Liquidity...'
      case 'creating':
        return 'Creating/Initializing Pool...'
      case 'idle':
        return 'Continue'
    }
  }, [createPoolState])

  const orderedTokens = useMemo(
    () => [orderedToken0, orderedToken1],
    [orderedToken0, orderedToken1],
  )

  async function handleCreatePool(): Promise<void> {
    try {
      if (
        !orderedToken0 ||
        !orderedToken1 ||
        !connectedAddress ||
        !isTickRangeValid
      ) {
        return
      }

      if (isAboveRange) {
        console.error('Cannot add liquidity: price is above range')
        return
      }

      if (
        !orderedToken0Amount ||
        Number.parseFloat(orderedToken0Amount) <= 0 ||
        !hasPairedAmount
      ) {
        console.error('Liquidity amounts are required')
        return
      }

      try {
        let poolAddress: StellarContractAddress

        if (existingPoolAddress && poolInitialized === true) {
          poolAddress = existingPoolAddress
        } else {
          if (!initSqrtPriceX96) {
            console.error('Initial price is required to create/initialize pool')
            return
          }

          setCreatePoolState('creating')
          const { result } = await createAndInitializePoolMutation.mutateAsync({
            tokenA: orderedToken0.address,
            tokenB: orderedToken1.address,
            fee: selectedFee,
            sqrtPriceX96: initSqrtPriceX96,
            userAddress: connectedAddress,
            signTransaction,
          })
          poolAddress = result.poolAddress
        }

        setCreatePoolState('adding_liquidity')
        const { result } = await addLiquidityMutation.mutateAsync({
          poolAddress,
          userAddress: connectedAddress,
          token0Amount: orderedToken0Amount,
          token1Amount: orderedToken1Amount,
          token0Decimals: orderedToken0.decimals,
          token1Decimals: orderedToken1.decimals,
          tickLower,
          tickUpper,
          recipient: connectedAddress,
          signTransaction,
          signAuthEntry,
        })

        onLiquidityAdded()
        setSuccessfulAdd({ poolAddress, txHash: result.txHash })
      } catch (error) {
        console.error(
          'Failed to create/initialize pool or add liquidity:',
          error,
        )
      }
    } finally {
      setCreatePoolState('idle')
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Checker.Connect namespace="stellar" fullWidth size="xl">
        <Checker.Guard
          guardWhen={!orderedToken0 || !orderedToken1}
          guardText="Select Tokens"
          fullWidth
          size="xl"
        >
          <Checker.Guard
            guardWhen={sameTokenSelected}
            guardText="Select Different Tokens"
            fullWidth
            size="xl"
          >
            <Checker.Amounts
              chainId={StellarChainId.STELLAR}
              amounts={checkerAmounts}
              fullWidth
              size="xl"
            >
              <Trustlines tokens={orderedTokens} fullWidth size="xl">
                <Checker.Guard
                  guardWhen={
                    (!existingPoolAddress || poolInitialized === false) &&
                    !initSqrtPriceX96
                  }
                  guardText="Set Start Price"
                  fullWidth
                  size="xl"
                >
                  <Checker.Guard
                    guardWhen={!isTickRangeValid}
                    guardText="Invalid Price Range"
                    fullWidth
                    size="xl"
                  >
                    <Checker.Guard
                      guardWhen={isAboveRange}
                      guardText="Price Above Range"
                      fullWidth
                      size="xl"
                    >
                      <Checker.Guard
                        guardWhen={!hasPairedAmount}
                        guardText={
                          pairedAmountStatus === 'error'
                            ? 'Invalid Amount'
                            : 'Calculating Amount'
                        }
                        fullWidth
                        size="xl"
                      >
                        <Checker.Guard
                          guardWhen={!ticksAligned}
                          guardText="Align Ticks & Continue"
                          fullWidth
                          size="xl"
                        >
                          <Checker.Guard
                            guardWhen={createPoolState !== 'idle'}
                            guardText={pendingText}
                            fullWidth
                            size="xl"
                          >
                            <Button
                              fullWidth
                              size="xl"
                              onClick={() => void handleCreatePool()}
                            >
                              Continue
                            </Button>
                          </Checker.Guard>
                        </Checker.Guard>
                      </Checker.Guard>
                    </Checker.Guard>
                  </Checker.Guard>
                </Checker.Guard>
              </Trustlines>
            </Checker.Amounts>
          </Checker.Guard>
        </Checker.Guard>
      </Checker.Connect>
      <Dialog
        open={successfulAdd !== undefined}
        onOpenChange={(open) => {
          if (!open) setSuccessfulAdd(undefined)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
            <DialogDescription className="font-medium">
              <a
                target="_blank"
                href={
                  successfulAdd
                    ? getStellarTxnLink(successfulAdd.txHash)
                    : undefined
                }
                className="cursor-pointer text-blue hover:underline"
                rel="noreferrer"
              >
                You successfully added liquidity to the {orderedToken0?.symbol}/
                {orderedToken1?.symbol} pair
              </a>
            </DialogDescription>
            <div className="flex justify-center py-6">
              <CheckMarkIcon width={132} height={132} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button asChild fullWidth size="xl">
                  <LinkInternal
                    href={
                      successfulAdd
                        ? `/stellar/pool/${successfulAdd.poolAddress}`
                        : '/stellar/explore/pools'
                    }
                  >
                    View your position
                  </LinkInternal>
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
