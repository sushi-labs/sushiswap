'use client'

import React, { useState } from 'react'
import { useStellarWallet } from '~stellar/providers'
import {
  useAddLiquidity,
  useGetQuote,
  usePoolsBetween,
  useSwapWithRouting,
} from '../../lib/hooks/swap'
import type { Token } from '../../lib/types/token.type'

interface AdvancedSwapWidgetProps {
  userAddress: string
  tokens: Token[]
}

export function AdvancedSwapWidget({
  userAddress,
  tokens,
}: AdvancedSwapWidgetProps) {
  const { signTransaction } = useStellarWallet()
  const [selectedTokenIn, setSelectedTokenIn] = useState<Token | null>(null)
  const [selectedTokenOut, setSelectedTokenOut] = useState<Token | null>(null)
  const [amountIn, setAmountIn] = useState('')
  const [slippage, setSlippage] = useState(0.005)

  // Convert amount to bigint for calculations
  const amountInBigInt =
    selectedTokenIn && amountIn
      ? BigInt(
          Math.floor(
            Number.parseFloat(amountIn) * 10 ** selectedTokenIn.decimals,
          ),
        )
      : 0n

  // Get quote for the swap
  const {
    data: quote,
    isLoading: isQuoteLoading,
    error: quoteError,
  } = useGetQuote({
    tokenIn: selectedTokenIn!,
    tokenOut: selectedTokenOut!,
    amountIn: amountInBigInt,
    enabled: !!(selectedTokenIn && selectedTokenOut && amountInBigInt > 0n),
  })

  // Get available pools
  const { data: pools } = usePoolsBetween({
    tokenA: selectedTokenIn!,
    tokenB: selectedTokenOut!,
    enabled: !!(selectedTokenIn && selectedTokenOut),
  })

  // Swap mutation
  const swapMutation = useSwapWithRouting()

  // Add liquidity mutation
  const addLiquidityMutation = useAddLiquidity()

  const handleSwap = async () => {
    if (!selectedTokenIn || !selectedTokenOut || !amountInBigInt) return

    try {
      await swapMutation.mutateAsync({
        userAddress,
        tokenIn: selectedTokenIn,
        tokenOut: selectedTokenOut,
        amountIn: amountInBigInt,
        slippage,
      })
    } catch (error) {
      console.error('Swap failed:', error)
    }
  }

  const handleAddLiquidity = async () => {
    if (!selectedTokenIn || !selectedTokenOut || !pools?.[0]) return

    try {
      // Convert amounts to properly scaled strings
      const token0AmountScaled = (
        Number(amountIn) /
        10 ** selectedTokenIn.decimals
      ).toString()
      const token1AmountScaled = quote
        ? (Number(quote.amountOut) / 10 ** selectedTokenOut.decimals).toString()
        : '0'

      await addLiquidityMutation.mutateAsync({
        userAddress,
        poolAddress: pools[0].address,
        token0Amount: token0AmountScaled,
        token1Amount: token1AmountScaled,
        tickLower: -60000,
        tickUpper: 60000,
        signTransaction,
      })
    } catch (error) {
      console.error('Add liquidity failed:', error)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Advanced Swap Widget
      </h2>

      {/* Token Selection */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="from-token"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            From Token
          </label>
          <select
            id="from-token"
            value={selectedTokenIn?.contract || ''}
            onChange={(e) => {
              const token = tokens.find((t) => t.contract === e.target.value)
              setSelectedTokenIn(token || null)
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select token</option>
            {tokens.map((token) => (
              <option key={token.contract} value={token.contract}>
                {token.code} - {token.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="to-token"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            To Token
          </label>
          <select
            id="to-token"
            value={selectedTokenOut?.contract || ''}
            onChange={(e) => {
              const token = tokens.find((t) => t.contract === e.target.value)
              setSelectedTokenOut(token || null)
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select token</option>
            {tokens.map((token) => (
              <option key={token.contract} value={token.contract}>
                {token.code} - {token.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount
          </label>
          <input
            id="amount"
            type="number"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.0"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Slippage */}
        <div>
          <label
            htmlFor="slippage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Slippage Tolerance (%)
          </label>
          <input
            id="slippage"
            type="number"
            value={slippage * 100}
            onChange={(e) =>
              setSlippage(Number.parseFloat(e.target.value) / 100)
            }
            step="0.1"
            min="0"
            max="50"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quote Display */}
      {quote && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Quote</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Route:</span>
              <span className="font-mono">
                {quote.path.map((token) => token.code).join(' → ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Amount Out:</span>
              <span className="font-mono">
                {selectedTokenOut
                  ? (
                      Number(quote.amountOut) /
                      10 ** selectedTokenOut.decimals
                    ).toFixed(6)
                  : '0'}{' '}
                {selectedTokenOut?.code}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Price Impact:</span>
              <span className="font-mono">
                {(quote.priceImpact * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Fees:</span>
              <span className="font-mono">
                {quote.fees.map((fee) => `${fee / 10000}%`).join(' + ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Available Pools */}
      {pools && pools.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h3 className="font-semibold mb-2">Available Pools</h3>
          <div className="space-y-1 text-sm">
            {pools.map((pool, index) => (
              <div key={pool.address} className="flex justify-between">
                <span>Pool {index + 1}:</span>
                <span className="font-mono">
                  {pool.tokenA.code}/{pool.tokenB.code} - {pool.fee / 10000}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {quoteError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            Error getting quote: {quoteError.message}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleSwap}
          disabled={!quote || swapMutation.isPending || isQuoteLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {swapMutation.isPending ? 'Swapping...' : 'Swap'}
        </button>

        {pools && pools.length > 0 && (
          <button
            type="button"
            onClick={handleAddLiquidity}
            disabled={addLiquidityMutation.isPending || !quote}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addLiquidityMutation.isPending
              ? 'Adding Liquidity...'
              : 'Add Liquidity'}
          </button>
        )}
      </div>

      {/* Loading States */}
      {isQuoteLoading && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Getting quote...
        </div>
      )}
    </div>
  )
}
