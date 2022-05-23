// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "../interfaces/trident/ITridentSwapAdapter.sol";

abstract contract TridentSwapAdapter is
    ITridentRouter,
    ImmutableState,
    BentoAdapter
{
    // Custom Error
    error TooLittleReceived();

    function _exactInput(ExactInputParams memory params)
        internal
        returns (uint256 amountOut)
    {
        if (params.amountIn == 0) {
            // Pay the first pool directly.
            (, params.amountIn) = bentoBox.deposit(
                params.tokenIn,
                address(this),
                params.path[0].pool,
                IERC20(params.tokenIn).balanceOf(address(this)),
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

            bentoBox.transfer(
                params.output[i].token,
                address(this),
                params.output[i].to,
                balanceShares
            );
        }
    }

    function _increment(uint256 i) internal pure returns (uint256) {
        unchecked {
            return i + 1;
        }
    }
}
