// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../libraries/UniswapV2Library.sol";
import "../base/ImmutableState.sol";

/// @title SushiLegacyAdapter
/// @notice Adapter for functions used to swap using Sushiswap Legacy AMM.
abstract contract SushiLegacyAdapter is ImmutableState {
    using SafeERC20 for IERC20;

    function _swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] memory path,
        address to,
        bool sendTokens
    ) internal returns (uint256 amountOut) {
        uint256[] memory amounts = UniswapV2Library.getAmountsOut(
            factory,
            amountIn,
            path,
            pairCodeHash
        );
        amountOut = amounts[amounts.length - 1];

        require(amountOut >= amountOutMin, "insufficient-amount-out");

        /// @dev force sends token to the first pair if not already sent
        if (sendTokens) {
            IERC20(path[0]).safeTransfer(
                UniswapV2Library.pairFor(
                    factory,
                    path[0],
                    path[1],
                    pairCodeHash
                ),
                IERC20(path[0]).balanceOf(address(this))
            );
        }
        _swap(amounts, path, to);
    }

    /// @dev requires the initial amount to have already been sent to the first pair
    function _swap(
        uint256[] memory amounts,
        address[] memory path,
        address _to
    ) internal virtual {
        for (uint256 i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = UniswapV2Library.sortTokens(input, output);
            uint256 amountOut = amounts[i + 1];
            (uint256 amount0Out, uint256 amount1Out) = input == token0
                ? (uint256(0), amountOut)
                : (amountOut, uint256(0));
            address to = i < path.length - 2
                ? UniswapV2Library.pairFor(
                    factory,
                    output,
                    path[i + 2],
                    pairCodeHash
                )
                : _to;
            IUniswapV2Pair(
                UniswapV2Library.pairFor(factory, input, output, pairCodeHash)
            ).swap(amount0Out, amount1Out, to, new bytes(0));
        }
    }
}