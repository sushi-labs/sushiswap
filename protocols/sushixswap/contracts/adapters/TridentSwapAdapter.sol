// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "../interfaces/trident/ITridentSwapAdapter.sol";

/// @title TridentSwapAdapter
/// @notice Adapter for all Trident based Swaps

abstract contract TridentSwapAdapter is
    ITridentRouter,
    ImmutableState,
    BentoAdapter,
    TokenAdapter
{
    // Custom Error
    error TooLittleReceived();

    /// @notice Swaps token A to token B directly. Swaps are done on `bento` tokens.
    /// @param params This includes the address of token A, pool, amount of token A to swap,
    /// minimum amount of token B after the swap and data required by the pool for the swap.
    /// @dev Ensure that the pool is trusted before calling this function. The pool can steal users' tokens.
    function _exactInput(ExactInputParams memory params)
        internal
        returns (uint256 amountOut)
    {
        if (params.amountIn == 0) {
          uint256 tokenBalance = IERC20(params.tokenIn).balanceOf(
                address(this)
            );
            _transferTokens(
                IERC20(params.tokenIn),
                address(bentoBox),
                tokenBalance
            );
            // Pay the first pool directly.
            (, params.amountIn) = bentoBox.deposit(
                params.tokenIn,
                address(bentoBox),
                params.path[0].pool,
                tokenBalance,
                0
            );
        }

        // Call every pool in the path.
        // Pool `N` should transfer its output tokens to pool `N+1` directly.
        // The last pool should transfer its output tokens to the user.
        // If the user wants to unwrap `wETH`, the final destination should be this contract and
        // a batch call should be made to `unwrapWETH`.
        uint256 n = params.path.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            amountOut = IPool(params.path[i].pool).swap(params.path[i].data);
        }
        // Ensure that the slippage wasn't too much. This assumes that the pool is honest.
        if (amountOut < params.amountOutMinimum) revert TooLittleReceived();
    }

    /// @notice Swaps multiple input tokens to multiple output tokens using multiple paths, in different percentages.
    /// For example, you can swap 50 DAI + 100 USDC into 60% ETH and 40% BTC.
    /// @param params This includes everything needed for the swap.
    /// Look at the `ComplexPathParams` struct for more details.
    /// @dev This function is not optimized for single swaps and should only be used in complex cases where
    /// the amounts are large enough that minimizing slippage by using multiple paths is worth the extra gas.
    function _complexPath(ComplexPathParams memory params) internal {
        // Deposit all initial tokens to respective pools and initiate the swaps.
        // Input tokens come from the user - output goes to following pools.
        uint256 n = params.initialPath.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            bentoBox.transfer(
                params.initialPath[i].tokenIn,
                address(this),
                params.initialPath[i].pool,
                params.initialPath[i].amount
            );
            IPool(params.initialPath[i].pool).swap(params.initialPath[i].data);
        }
        // Do all the middle swaps. Input comes from previous pools.
        n = params.percentagePath.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            uint256 balanceShares = bentoBox.balanceOf(
                params.percentagePath[i].tokenIn,
                address(this)
            );
            uint256 transferShares = (balanceShares *
                params.percentagePath[i].balancePercentage) / uint256(10)**8;
            bentoBox.transfer(
                params.percentagePath[i].tokenIn,
                address(this),
                params.percentagePath[i].pool,
                transferShares
            );
            IPool(params.percentagePath[i].pool).swap(
                params.percentagePath[i].data
            );
        }
        // Ensure enough was received and transfer the ouput to the recipient.
        n = params.output.length;
        for (uint256 i = 0; i < n; i = _increment(i)) {
            uint256 balanceShares = bentoBox.balanceOf(
                params.output[i].token,
                address(this)
            );
            if (balanceShares < params.output[i].minAmount)
                revert TooLittleReceived();
            if (params.output[i].unwrapBento) {
                bentoBox.withdraw(
                    params.output[i].token,
                    address(this),
                    params.output[i].to,
                    0,
                    balanceShares
                );
            } else {
                bentoBox.transfer(
                    params.output[i].token,
                    address(this),
                    params.output[i].to,
                    balanceShares
                );
            }
        }
    }

    function _increment(uint256 i) internal pure returns (uint256) {
        unchecked {
            return i + 1;
        }
    }
}