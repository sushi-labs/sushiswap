'use client'

import { createToast } from '@sushiswap/notifications'
import { Button, FormSection, SelectIcon, TextField } from '@sushiswap/ui'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  useGetPool,
  usePoolInfo,
  useTokenBalance,
} from '~stellar/_common/lib/hooks'
import { useCreatePool } from '~stellar/_common/lib/hooks/factory/use-create-pool'
import { useCalculatePairedAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-paired-amount'
import { useMaxPairedAmount } from '~stellar/_common/lib/hooks/pool/use-max-paired-amount'
import { usePoolBalances } from '~stellar/_common/lib/hooks/pool/use-pool-balances'
import {
  invalidatePoolInitializedQuery,
  usePoolInitialized,
} from '~stellar/_common/lib/hooks/pool/use-pool-initialized'
import { useAddLiquidity } from '~stellar/_common/lib/hooks/swap/use-add-liquidity'
import {
  getPool,
  initializePoolIfNeeded,
} from '~stellar/_common/lib/soroban/dex-factory-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { formatTokenAmount } from '~stellar/_common/lib/utils/format'
import { getStellarTxnLink } from '~stellar/_common/lib/utils/stellarchain-helpers'
import { ConnectWalletButton } from '~stellar/_common/ui/ConnectWallet/ConnectWalletButton'
import TokenSelector from '~stellar/_common/ui/token-selector/token-selector'
import { useStellarWallet } from '~stellar/providers'

const FEE_TIERS = [
  { value: 500, label: '0.05%', description: 'Best for very stable pairs' },
  { value: 3000, label: '0.3%', description: 'Best for most pairs' },
  { value: 10000, label: '1%', description: 'Best for volatile pairs' },
]

// Tick spacing for fee tiers (Uniswap V3 standard)
const TICK_SPACINGS: Record<number, number> = {
  500: 10, // 0.05% fee
  3000: 60, // 0.3% fee
  10000: 200, // 1% fee
}

// Align tick to the nearest valid tick based on spacing
function alignTick(tick: number, spacing: number): number {
  return Math.round(tick / spacing) * spacing
}

// Check if a tick is properly aligned to the spacing
function isTickAligned(tick: number, spacing: number): boolean {
  return tick % spacing === 0
}

export default function AddPoolPage() {
  const { isConnected, connectedAddress, signTransaction } = useStellarWallet()
  const router = useRouter()
  const createPoolMutation = useCreatePool()
  const addLiquidityMutation = useAddLiquidity()
  const queryClient = useQueryClient()

  const [token0, setToken0] = useState<Token | undefined>(undefined)
  const [token1, setToken1] = useState<Token | undefined>(undefined)
  const [selectedFee, setSelectedFee] = useState<number>(3000)
  const [token0Amount, setToken0Amount] = useState<string>('')
  const [manualToken1Amount, setManualToken1Amount] = useState<string>('') // For new pools
  const [tickLower, setTickLower] = useState<number>(-60000)
  const [tickUpper, setTickUpper] = useState<number>(60000)
  const [ticksAligned, setTicksAligned] = useState<boolean>(true)

  const { data: token0Balance } = useTokenBalance(
    connectedAddress,
    token0?.contract || null,
  )
  const { data: token1Balance } = useTokenBalance(
    connectedAddress,
    token1?.contract || null,
  )

  // Check if pool already exists
  const { data: existingPoolAddress } = useGetPool(
    token0 && token1
      ? {
          tokenA: token0.contract,
          tokenB: token1.contract,
          fee: selectedFee,
        }
      : null,
  )

  // Check if existing pool is initialized
  const { data: poolInitialized } = usePoolInitialized(existingPoolAddress)

  const { data: poolInfo } = usePoolInfo(existingPoolAddress ?? null)
  const reversedPoolTokenOrder = poolInfo?.token0.contract !== token0?.contract

  // Auto-calculate token1 amount based on token0 input (only if pool exists)
  const { data: pairedAmountData } = useCalculatePairedAmount(
    existingPoolAddress || null,
    token0Amount,
    tickLower,
    tickUpper,
    token0?.decimals || 7,
  )

  const { data: poolBalanceData } = usePoolBalances(
    existingPoolAddress || null,
    connectedAddress,
  )
  const { data: maxPairedAmountData } = useMaxPairedAmount(
    existingPoolAddress || null,
    poolBalanceData?.token0.amount || '0',
    poolBalanceData?.token1.amount || '0',
    tickLower,
    tickUpper,
    poolInfo?.token0.decimals,
    poolInfo?.token1.decimals,
  )

  // Use auto-calculated amount for existing pools, manual input for new pools or uninitialized pools
  const token1Amount = useMemo(() => {
    if (manualToken1Amount) {
      return manualToken1Amount
    }
    if (!pairedAmountData || !token0 || !token1) {
      return ''
    }
    const rawToken0Amount = BigInt(
      Math.floor(Number.parseFloat(token0Amount) * 10 ** token0.decimals),
    )
    const rawToken1Amount = BigInt(
      Math.floor(
        Number.parseFloat(pairedAmountData.token1Amount) *
          10 ** token1.decimals,
      ),
    )
    const amount = reversedPoolTokenOrder
      ? formatTokenAmount(
          (rawToken0Amount * rawToken0Amount) / rawToken1Amount,
          token1.decimals,
        )
      : pairedAmountData.token1Amount
    return amount
  }, [
    token0,
    token1,
    token0Amount,
    pairedAmountData,
    manualToken1Amount,
    reversedPoolTokenOrder,
  ])

  const pairedAmountStatus = pairedAmountData?.status || 'idle'

  // Realign ticks when fee tier changes
  useEffect(() => {
    const spacing = TICK_SPACINGS[selectedFee]
    setTickLower((prev) => alignTick(prev, spacing))
    setTickUpper((prev) => alignTick(prev, spacing))
  }, [selectedFee])

  // Check if ticks are aligned whenever they change
  useEffect(() => {
    const spacing = TICK_SPACINGS[selectedFee]
    const lowerAligned = isTickAligned(tickLower, spacing)
    const upperAligned = isTickAligned(tickUpper, spacing)
    setTicksAligned(lowerAligned && upperAligned)
  }, [tickLower, tickUpper, selectedFee])

  const handleCreatePool = async () => {
    if (!token0 || !token1 || !connectedAddress) return

    // Auto-align ticks if they're not aligned
    const spacing = TICK_SPACINGS[selectedFee]
    const alignedLower = alignTick(tickLower, spacing)
    const alignedUpper = alignTick(tickUpper, spacing)

    if (alignedLower !== tickLower || alignedUpper !== tickUpper) {
      setTickLower(alignedLower)
      setTickUpper(alignedUpper)
      // Wait for state to update before proceeding
      return
    }

    // Safety check: prevent adding liquidity when price is above range
    if (isAboveRange) {
      console.error('Cannot add liquidity: price is above range')
      return
    }

    // Validate liquidity amounts are provided
    if (
      !token0Amount ||
      !token1Amount ||
      Number.parseFloat(token0Amount) <= 0 ||
      Number.parseFloat(token1Amount) <= 0
    ) {
      console.error('Liquidity amounts are required')
      return
    }

    // Validate tick spacing based on selected fee tier
    const tickSpacing = TICK_SPACINGS[selectedFee]
    if (tickLower % tickSpacing !== 0 || tickUpper % tickSpacing !== 0) {
      console.error(`Tick values must be multiples of ${tickSpacing}`)
      alert(
        `Tick values must be multiples of ${tickSpacing} for the selected fee tier`,
      )
      return
    }

    if (tickLower >= tickUpper) {
      console.error('Tick lower must be less than tick upper')
      alert('Tick lower must be less than tick upper')
      return
    }

    try {
      let poolAddress: string

      try {
        const result = await createPoolMutation.mutateAsync({
          tokenA: token0.contract,
          tokenB: token1.contract,
          fee: selectedFee,
        })
        poolAddress = result.poolAddress
      } catch (createError: any) {
        // Check if pool already exists
        const errorMessage = createError?.message || String(createError)
        const poolExistsMatch = errorMessage.match(
          /Pool already exists at address: ([A-Z0-9]{56})/,
        )

        if (poolExistsMatch) {
          poolAddress = poolExistsMatch[1]
        } else {
          // If it's not a "pool exists" error, rethrow
          throw createError
        }
      }

      const initializeTxHash = await initializePoolIfNeeded({
        poolAddress,
        sourceAccount: connectedAddress,
        signTransaction,
        tokenAmountA: reversedPoolTokenOrder ? token1Amount : token0Amount,
        tokenAmountB: reversedPoolTokenOrder ? token0Amount : token1Amount,
      })

      if (initializeTxHash) {
        createToast({
          account: connectedAddress || undefined,
          type: 'swap',
          chainId: 1,
          txHash: initializeTxHash,
          href: getStellarTxnLink(initializeTxHash),
          promise: Promise.resolve({ hash: initializeTxHash }),
          summary: {
            pending: 'Initializing pool...',
            completed: 'Pool initialized successfully',
            failed: 'Pool initialization failed',
          },
          groupTimestamp: Date.now(),
          timestamp: Date.now(),
        })

        invalidatePoolInitializedQuery(queryClient, poolAddress)
      }

      // Add liquidity (required)
      await addLiquidityMutation.mutateAsync({
        poolAddress,
        userAddress: connectedAddress,
        token0Amount: reversedPoolTokenOrder ? token1Amount : token0Amount,
        token1Amount: reversedPoolTokenOrder ? token0Amount : token1Amount,
        tickLower,
        tickUpper,
        recipient: connectedAddress,
        signTransaction,
      })

      // Redirect to the pool page
      router.push(`/stellar/pool/${poolAddress}`)
    } catch (error) {
      console.error('Failed to create pool or add liquidity:', error)
    }
  }

  // Check if we have valid amounts
  const hasToken0Amount =
    token0Amount && token0Amount !== '0' && Number.parseFloat(token0Amount) > 0

  // For new pools (no existing pool), we need manual token1 input
  // For existing initialized pools, token1 is auto-calculated
  // For existing uninitialized pools, we need both amounts to set price
  const hasValidAmounts =
    existingPoolAddress && poolInitialized === true
      ? hasToken0Amount // Pool exists and initialized: only need token0, token1 is auto-calculated
      : hasToken0Amount && token1Amount && Number.parseFloat(token1Amount) > 0 // New pool or uninitialized pool: need both amounts

  // Prevent creation when price is above range (can't provide token0)
  const isAboveRange =
    existingPoolAddress && pairedAmountStatus === 'above-range'

  const canCreate =
    token0 &&
    token1 &&
    token0.contract !== token1.contract &&
    hasValidAmounts &&
    !isAboveRange
  const isCreating =
    createPoolMutation.isPending || addLiquidityMutation.isPending

  return (
    <>
      {/* Token Selection */}
      <FormSection
        title="Tokens"
        description="Select the token pair. If a pool exists, liquidity will be added to it."
      >
        <div className="flex gap-3">
          <TokenSelector
            id="token0-selector"
            selected={token0}
            onSelect={setToken0}
          >
            <Button variant="secondary" className="w-full">
              <span>{token0?.code ?? 'Select Token'}</span>
              <div>
                <SelectIcon />
              </div>
            </Button>
          </TokenSelector>
          <TokenSelector
            id="token1-selector"
            selected={token1}
            onSelect={setToken1}
          >
            <Button variant="secondary" className="w-full">
              <span>{token1?.code ?? 'Select Token'}</span>
              <div>
                <SelectIcon />
              </div>
            </Button>
          </TokenSelector>
        </div>
        {token0 && token1 && token0.contract === token1.contract && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mt-3">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Please select two different tokens
            </p>
          </div>
        )}
      </FormSection>

      {/* Fee Tier Selection */}
      <FormSection
        title="Fee Tier"
        description="Select the trading fee percentage for this pool"
      >
        <div className="grid gap-2">
          {FEE_TIERS.map((tier) => (
            <button
              key={tier.value}
              type="button"
              onClick={() => setSelectedFee(tier.value)}
              className={`
                p-4 rounded-xl border-2 text-left transition-all
                ${
                  selectedFee === tier.value
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{tier.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {tier.description}
                  </div>
                </div>
                {selectedFee === tier.value && (
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </FormSection>

      {/* Initial Liquidity */}
      <FormSection
        title="Initial Liquidity"
        description={
          existingPoolAddress && poolInitialized === true
            ? `Enter ${token0?.code || 'token0'} amount - ${token1?.code || 'token1'} amount will be calculated automatically.`
            : existingPoolAddress && poolInitialized === false
              ? 'This pool exists but is not initialized. Enter both token amounts to set the initial price ratio.'
              : 'Add liquidity to your pool. Both amounts are required.'
        }
      >
        <section className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center">
              {token0 && (
                <span className="text-sm font-medium">{token0.code}</span>
              )}
              {token0 &&
                token0Balance !== null &&
                token0Balance !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    {formatTokenAmount(token0Balance, token0.decimals)}
                  </span>
                )}
            </div>
            <TextField
              type="number"
              label={token0?.code || 'Token 1'}
              placeholder="0.0"
              value={token0Amount}
              onValueChange={(value) => {
                if (value === '') {
                  setToken0Amount('')
                  return
                }
                if (
                  !token0 ||
                  (existingPoolAddress &&
                    poolInitialized === true &&
                    !maxPairedAmountData)
                ) {
                  return
                }
                const rawAmountValue = BigInt(
                  Math.floor(Number.parseFloat(value) * 10 ** token0.decimals),
                )
                // Check to see if token0 and token1 are swapped in the pool config
                const maxPairedToken0Amount = reversedPoolTokenOrder
                  ? BigInt(maxPairedAmountData?.maxToken1Amount ?? '0')
                  : BigInt(maxPairedAmountData?.maxToken0Amount ?? '0')
                const maxAmount =
                  existingPoolAddress && poolInitialized === true
                    ? maxPairedToken0Amount
                    : (token0Balance ?? 0n)
                if (rawAmountValue >= maxAmount) {
                  setToken0Amount(formatTokenAmount(maxAmount, token0.decimals))
                } else {
                  setToken0Amount(value)
                }
              }}
              required
            />
          </div>
          <div className="flex items-center justify-center -my-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <span className="text-lg">+</span>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between items-center">
                {token1 && (
                  <span className="text-sm font-medium">{token1.code}</span>
                )}
                {token1 &&
                  token1Balance !== null &&
                  token1Balance !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {formatTokenAmount(token1Balance, token1.decimals)}
                    </span>
                  )}
              </div>
              <TextField
                type={
                  existingPoolAddress && poolInitialized === true
                    ? 'text'
                    : 'number'
                }
                label={token1?.code || 'Token 2'}
                placeholder={
                  existingPoolAddress && poolInitialized === true
                    ? 'Auto-calculated'
                    : '0.0'
                }
                value={token1Amount}
                onValueChange={
                  existingPoolAddress && poolInitialized === true
                    ? undefined
                    : (value) => {
                        if (
                          !token1 ||
                          token1Balance === null ||
                          token1Balance === undefined
                        ) {
                          return
                        }
                        const rawAmountValue = BigInt(
                          Math.floor(
                            Number.parseFloat(value) * 10 ** token1.decimals,
                          ),
                        )
                        if (rawAmountValue >= token1Balance) {
                          setManualToken1Amount(
                            formatTokenAmount(token1Balance, token1.decimals),
                          )
                        } else {
                          setManualToken1Amount(value)
                        }
                      }
                }
                disabled={!!existingPoolAddress && poolInitialized === true}
                required={!existingPoolAddress || poolInitialized === false}
              />
            </div>
            {existingPoolAddress &&
              poolInitialized === true &&
              pairedAmountStatus === 'below-range' &&
              token0Amount && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Price below range - only {token0?.code} needed
                </p>
              )}
            {existingPoolAddress &&
              poolInitialized === true &&
              pairedAmountStatus === 'above-range' &&
              token0Amount && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Price above range - cannot provide {token0?.code} liquidity
                </p>
              )}
            {existingPoolAddress &&
              poolInitialized === true &&
              pairedAmountData?.error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {pairedAmountData.error}
                </p>
              )}
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div>
              <div className="text-sm font-medium mb-3 block">
                Price Range Strategy
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Button
                  type="button"
                  size="sm"
                  variant={
                    tickLower === -60000 && tickUpper === 60000
                      ? 'default'
                      : 'secondary'
                  }
                  onClick={() => {
                    const spacing = TICK_SPACINGS[selectedFee]
                    setTickLower(alignTick(-60000, spacing))
                    setTickUpper(alignTick(60000, spacing))
                  }}
                  className="flex-1"
                >
                  Full Range
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={
                    tickLower ===
                      alignTick(-6000, TICK_SPACINGS[selectedFee]) &&
                    tickUpper === alignTick(6000, TICK_SPACINGS[selectedFee])
                      ? 'default'
                      : 'secondary'
                  }
                  onClick={() => {
                    const spacing = TICK_SPACINGS[selectedFee]
                    setTickLower(alignTick(-6000, spacing))
                    setTickUpper(alignTick(6000, spacing))
                  }}
                  className="flex-1"
                >
                  ±10%
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={
                    tickLower === alignTick(-600, TICK_SPACINGS[selectedFee]) &&
                    tickUpper === alignTick(600, TICK_SPACINGS[selectedFee])
                      ? 'default'
                      : 'secondary'
                  }
                  onClick={() => {
                    const spacing = TICK_SPACINGS[selectedFee]
                    setTickLower(alignTick(-600, spacing))
                    setTickUpper(alignTick(600, spacing))
                  }}
                  className="flex-1"
                >
                  ±1%
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Custom Range</span>
                <span className="text-xs text-muted-foreground">
                  Multiples of {TICK_SPACINGS[selectedFee]} only
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground mb-1 block">
                    Min Tick
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const spacing = TICK_SPACINGS[selectedFee]
                        setTickLower(alignTick(tickLower - spacing, spacing))
                      }}
                      className="w-10 px-0"
                    >
                      -
                    </Button>
                    <TextField
                      type="number"
                      placeholder="-60000"
                      value={tickLower.toString()}
                      onValueChange={(val) => {
                        // Allow free typing - don't auto-align yet
                        const tick = Number.parseInt(val)
                        if (Number.isNaN(tick)) {
                          setTickLower(0)
                        } else {
                          setTickLower(tick)
                        }
                      }}
                      onBlur={(e) => {
                        // Only align when user clicks away
                        const tick = Number.parseInt(e.target.value) || 0
                        const spacing = TICK_SPACINGS[selectedFee]
                        setTickLower(alignTick(tick, spacing))
                      }}
                      step={TICK_SPACINGS[selectedFee]}
                      className="w-full text-center font-mono"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const spacing = TICK_SPACINGS[selectedFee]
                        setTickLower(alignTick(tickLower + spacing, spacing))
                      }}
                      className="w-10 px-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground mb-1 block">
                    Max Tick
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const spacing = TICK_SPACINGS[selectedFee]
                        setTickUpper(alignTick(tickUpper - spacing, spacing))
                      }}
                      className="w-10 px-0"
                    >
                      -
                    </Button>
                    <TextField
                      type="number"
                      placeholder="60000"
                      value={tickUpper.toString()}
                      onValueChange={(val) => {
                        // Allow free typing - don't auto-align yet
                        const tick = Number.parseInt(val)
                        if (Number.isNaN(tick)) {
                          setTickUpper(0)
                        } else {
                          setTickUpper(tick)
                        }
                      }}
                      onBlur={(e) => {
                        // Only align when user clicks away
                        const tick = Number.parseInt(e.target.value) || 0
                        const spacing = TICK_SPACINGS[selectedFee]
                        setTickUpper(alignTick(tick, spacing))
                      }}
                      step={TICK_SPACINGS[selectedFee]}
                      className="w-full text-center font-mono"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const spacing = TICK_SPACINGS[selectedFee]
                        setTickUpper(alignTick(tickUpper + spacing, spacing))
                      }}
                      className="w-10 px-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div
                className={`p-3 border rounded-lg ${
                  ticksAligned
                    ? 'bg-blue-500/5 border-blue-500/20'
                    : 'bg-yellow-500/10 border-yellow-500/20'
                }`}
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Range:</span>
                  <span className="font-mono font-semibold">
                    {tickLower} to {tickUpper}
                  </span>
                </div>
                {ticksAligned ? (
                  <p className="text-xs text-muted-foreground mt-2">
                    Ticks must be multiples of {TICK_SPACINGS[selectedFee]}{' '}
                    (spacing for {selectedFee / 10000}% fee tier). Type any
                    value and it will auto-align to the nearest valid tick.
                  </p>
                ) : (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
                    ⚠️ Ticks must be multiples of {TICK_SPACINGS[selectedFee]}.
                    Click outside the input to auto-align, or click "Align Ticks
                    & Continue" to proceed.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {token0 && token1 && !hasValidAmounts && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {existingPoolAddress && poolInitialized === true
                ? `Enter ${token0.code} amount to add liquidity`
                : existingPoolAddress && poolInitialized === false
                  ? 'Both token amounts are required to initialize the pool and add liquidity'
                  : 'Both token amounts are required to create a pool'}
            </p>
          </div>
        )}
        {existingPoolAddress && poolInitialized === true && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              Pool already exists - liquidity will be added to existing pool
            </p>
          </div>
        )}
        {existingPoolAddress && poolInitialized === false && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              ⚠️ Pool exists but is not initialized. Enter both token amounts to
              set the initial price, then add liquidity.
            </p>
          </div>
        )}
      </FormSection>
      <FormSection title="" description="">
        <div className="flex w-full flex-col">
          {!isConnected ? (
            <ConnectWalletButton fullWidth size="xl" />
          ) : (
            <Button
              fullWidth
              size="xl"
              disabled={!canCreate || isCreating}
              onClick={handleCreatePool}
            >
              {isCreating
                ? addLiquidityMutation.isPending
                  ? 'Adding Liquidity...'
                  : 'Creating Pool...'
                : isAboveRange
                  ? 'Price Above Range'
                  : !token0 || !token1
                    ? 'Select Tokens'
                    : !hasValidAmounts
                      ? 'Enter Liquidity Amounts'
                      : !ticksAligned
                        ? 'Align Ticks & Continue'
                        : 'Continue'}
            </Button>
          )}
        </div>
      </FormSection>
    </>
  )
}
