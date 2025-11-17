'use client'

import { Button, FormSection, SelectIcon, TextField } from '@sushiswap/ui'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  useGetPool,
  usePoolInfo,
  useTokenBalance,
} from '~stellar/_common/lib/hooks'
import { useCreateAndInitializePool } from '~stellar/_common/lib/hooks/factory/use-create-and-initialize-pool'
import { useCalculatePairedAmount } from '~stellar/_common/lib/hooks/pool/use-calculate-paired-amount'
import { useMaxPairedAmount } from '~stellar/_common/lib/hooks/pool/use-max-paired-amount'
import { usePoolBalances } from '~stellar/_common/lib/hooks/pool/use-pool-balances'
import { usePoolInitialized } from '~stellar/_common/lib/hooks/pool/use-pool-initialized'
import { usePoolPrice } from '~stellar/_common/lib/hooks/pool/use-pool-price'
import { useAddLiquidity } from '~stellar/_common/lib/hooks/swap/use-add-liquidity'
import { useTickRangeSelector } from '~stellar/_common/lib/hooks/tick/use-tick-range-selector'
import {
  calculatePriceFromSqrtPrice,
  encodePriceSqrt,
} from '~stellar/_common/lib/soroban'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { formatTokenAmount } from '~stellar/_common/lib/utils/format'
import { FEE_TIERS, TICK_SPACINGS } from '~stellar/_common/lib/utils/ticks'
import { ConnectWalletButton } from '~stellar/_common/ui/ConnectWallet/ConnectWalletButton'
import { TickRangeSelector } from '~stellar/_common/ui/TickRangeSelector/TickRangeSelector.tsx'
import TokenSelector from '~stellar/_common/ui/token-selector/token-selector'
import { useStellarWallet } from '~stellar/providers'

export default function AddPoolPage() {
  const { isConnected, connectedAddress, signTransaction } = useStellarWallet()
  const router = useRouter()
  const createAndInitializePoolMutation = useCreateAndInitializePool()
  const addLiquidityMutation = useAddLiquidity()

  const [token0, setToken0] = useState<Token | undefined>(undefined)
  const [token1, setToken1] = useState<Token | undefined>(undefined)
  const [selectedFee, setSelectedFee] = useState<number>(3000)
  const [orderedToken0Amount, setOrderedToken0Amount] = useState<string>('')
  const [manualOrderedToken1Amount, setManualOrderedToken1Amount] =
    useState<string>('') // For new pools

  const reversedPoolTokenOrder =
    token0 && token1 && token0.contract > token1.contract

  const [orderedToken0, orderedToken1] = reversedPoolTokenOrder
    ? [token1, token0]
    : [token0, token1]

  const { data: orderedToken0Balance } = useTokenBalance(
    connectedAddress,
    orderedToken0?.contract || null,
  )
  const { data: orderedToken1Balance } = useTokenBalance(
    connectedAddress,
    orderedToken1?.contract || null,
  )

  // Check if pool already exists
  const { data: existingPoolAddress } = useGetPool(
    orderedToken0 && orderedToken1
      ? {
          tokenA: orderedToken0.contract,
          tokenB: orderedToken1.contract,
          fee: selectedFee,
        }
      : null,
  )

  // Check if existing pool is initialized
  const { data: poolInitialized } = usePoolInitialized(existingPoolAddress)

  const { data: poolInfo } = usePoolInfo(existingPoolAddress ?? null)

  const { data: currentPrice } = usePoolPrice(existingPoolAddress ?? null)
  const initSqrtPriceX96 = useMemo(() => {
    if (!orderedToken0 || !orderedToken1) {
      return undefined
    }
    const orderedToken0AmountRaw = BigInt(
      Math.floor(Number(orderedToken0Amount) * 10 ** orderedToken0.decimals),
    )
    const orderedToken1AmountRaw = BigInt(
      Math.floor(
        Number(manualOrderedToken1Amount) * 10 ** orderedToken1.decimals,
      ),
    )
    if (orderedToken0AmountRaw === 0n || orderedToken1AmountRaw === 0n) {
      return undefined
    }
    return encodePriceSqrt(orderedToken1AmountRaw, orderedToken0AmountRaw)
  }, [
    orderedToken0,
    orderedToken1,
    orderedToken0Amount,
    manualOrderedToken1Amount,
  ])
  const initPrice =
    initSqrtPriceX96 !== undefined
      ? calculatePriceFromSqrtPrice(initSqrtPriceX96)
      : undefined

  const tickRangeSelectorState = useTickRangeSelector(
    selectedFee,
    (existingPoolAddress && poolInitialized === true && currentPrice
      ? currentPrice
      : initPrice) ?? 1,
  )
  const { tickLower, tickUpper, isTickRangeValid, ticksAligned } =
    tickRangeSelectorState

  // Auto-calculate token1 amount based on token0 input (only if pool exists)
  const { data: pairedAmountData } = useCalculatePairedAmount(
    existingPoolAddress || null,
    orderedToken0Amount,
    tickLower,
    tickUpper,
    orderedToken0?.decimals || 7,
    orderedToken0?.code,
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
    poolInfo?.token0.decimals || 7,
    poolInfo?.token1.decimals || 7,
  )

  // Use auto-calculated amount for existing pools, manual input for new pools or uninitialized pools
  const orderedToken1Amount = useMemo(() => {
    if (manualOrderedToken1Amount) {
      return manualOrderedToken1Amount
    }
    if (pairedAmountData) {
      return pairedAmountData.token1Amount
    }
    return ''
  }, [pairedAmountData, manualOrderedToken1Amount])

  const pairedAmountStatus = pairedAmountData?.status || 'idle'

  const handleCreatePool = async () => {
    if (
      !orderedToken0 ||
      !orderedToken1 ||
      !connectedAddress ||
      !isTickRangeValid
    )
      return

    // Safety check: prevent adding liquidity when price is above range
    if (isAboveRange) {
      console.error('Cannot add liquidity: price is above range')
      return
    }

    // Validate liquidity amounts are provided
    if (
      !orderedToken0Amount ||
      !orderedToken1Amount ||
      Number.parseFloat(orderedToken0Amount) <= 0 ||
      Number.parseFloat(orderedToken1Amount) <= 0 ||
      !initSqrtPriceX96
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
      const { result } = await createAndInitializePoolMutation.mutateAsync({
        tokenA: orderedToken0.contract,
        tokenB: orderedToken1.contract,
        fee: selectedFee,
        sqrtPriceX96: initSqrtPriceX96,
        userAddress: connectedAddress,
        signTransaction,
      })
      const poolAddress = result.poolAddress

      // Add liquidity (required)
      await addLiquidityMutation.mutateAsync({
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
      })

      // Redirect to the pool page
      router.push(`/stellar/pool/${poolAddress}`)
    } catch (error) {
      console.error('Failed to create/initialize pool or add liquidity:', error)
    }
  }

  // Check if we have valid amounts
  const hasOrderedToken0Amount =
    orderedToken0Amount &&
    orderedToken0Amount !== '0' &&
    Number.parseFloat(orderedToken0Amount) > 0

  // For new pools (no existing pool), we need manual token1 input
  // For existing initialized pools, token1 is auto-calculated
  // For existing uninitialized pools, we need both amounts to set price
  const hasValidAmounts =
    existingPoolAddress && poolInitialized === true
      ? hasOrderedToken0Amount // Pool exists and initialized: only need token0, token1 is auto-calculated
      : hasOrderedToken0Amount &&
        orderedToken1Amount &&
        Number.parseFloat(orderedToken1Amount) > 0 // New pool or uninitialized pool: need both amounts

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
    createAndInitializePoolMutation.isPending || addLiquidityMutation.isPending

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
            ? `Enter ${orderedToken0?.code || 'token0'} amount - ${orderedToken1?.code || 'token1'} amount will be calculated automatically.`
            : existingPoolAddress && poolInitialized === false
              ? 'This pool exists but is not initialized. Enter both token amounts to set the initial price ratio.'
              : 'Add liquidity to your pool. Both amounts are required.'
        }
      >
        <section className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center">
              {orderedToken0 && (
                <span className="text-sm font-medium">
                  {orderedToken0.code}
                </span>
              )}
              {orderedToken0 &&
                orderedToken0Balance !== null &&
                orderedToken0Balance !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    {formatTokenAmount(
                      orderedToken0Balance,
                      orderedToken0.decimals,
                    )}
                  </span>
                )}
            </div>
            <TextField
              type="number"
              label={orderedToken0?.code || 'Token 1'}
              placeholder="0.0"
              value={orderedToken0Amount}
              onValueChange={(value) => {
                if (value === '') {
                  setOrderedToken0Amount('')
                  return
                }
                if (
                  !orderedToken0 ||
                  (existingPoolAddress &&
                    poolInitialized === true &&
                    !maxPairedAmountData)
                ) {
                  return
                }
                const rawAmountValue = BigInt(
                  Math.floor(
                    Number.parseFloat(value) * 10 ** orderedToken0.decimals,
                  ),
                )
                const maxAmount =
                  existingPoolAddress && poolInitialized === true
                    ? BigInt(maxPairedAmountData?.maxToken0Amount ?? '0')
                    : (orderedToken0Balance ?? 0n)
                if (rawAmountValue >= maxAmount) {
                  setOrderedToken0Amount(
                    formatTokenAmount(maxAmount, orderedToken0.decimals),
                  )
                } else {
                  setOrderedToken0Amount(value)
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
                {orderedToken1 && (
                  <span className="text-sm font-medium">
                    {orderedToken1.code}
                  </span>
                )}
                {orderedToken1 &&
                  orderedToken1Balance !== null &&
                  orderedToken1Balance !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {formatTokenAmount(
                        orderedToken1Balance,
                        orderedToken1.decimals,
                      )}
                    </span>
                  )}
              </div>
              <TextField
                type={
                  existingPoolAddress && poolInitialized === true
                    ? 'text'
                    : 'number'
                }
                label={orderedToken1?.code || 'Token 2'}
                placeholder={
                  existingPoolAddress && poolInitialized === true
                    ? 'Auto-calculated'
                    : '0.0'
                }
                value={orderedToken1Amount}
                onValueChange={
                  existingPoolAddress && poolInitialized === true
                    ? undefined
                    : (value) => {
                        if (value === '') {
                          setManualOrderedToken1Amount('')
                          return
                        }
                        if (
                          !orderedToken1 ||
                          (existingPoolAddress &&
                            poolInitialized === true &&
                            !maxPairedAmountData)
                        ) {
                          return
                        }
                        const rawAmountValue = BigInt(
                          Math.floor(
                            Number.parseFloat(value) *
                              10 ** orderedToken1.decimals,
                          ),
                        )
                        const maxAmount =
                          existingPoolAddress && poolInitialized === true
                            ? BigInt(
                                maxPairedAmountData?.maxToken1Amount ?? '0',
                              )
                            : (orderedToken1Balance ?? 0n)
                        if (rawAmountValue >= maxAmount) {
                          setManualOrderedToken1Amount(
                            formatTokenAmount(
                              maxAmount,
                              orderedToken1.decimals,
                            ),
                          )
                        } else {
                          setManualOrderedToken1Amount(value)
                        }
                      }
                }
                disabled={!!existingPoolAddress && poolInitialized === true}
                required={!existingPoolAddress || poolInitialized === false}
              />
            </div>
            {existingPoolAddress &&
              poolInitialized === true &&
              pairedAmountData?.error && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {pairedAmountData.error}
                </p>
              )}
          </div>
          <TickRangeSelector
            params={tickRangeSelectorState}
            token0={orderedToken0}
            token1={orderedToken1}
          />
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
                  : 'Creating/Initializing Pool...'
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
