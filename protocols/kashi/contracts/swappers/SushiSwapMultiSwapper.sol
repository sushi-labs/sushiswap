// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol";
import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "../libraries/UniswapV2Library.sol";
import "@sushiswap/core/contracts/uniswapv2/libraries/TransferHelper.sol";
import "@sushiswap/bentobox-sdk/contracts/IBentoBoxV1.sol";

contract SushiSwapMultiSwapper {
    using BoringERC20 for IERC20;
    using BoringMath for uint256;

    address private immutable factory;

    IBentoBoxV1 private immutable bentoBox;

    bytes32 private immutable pairCodeHash;

    constructor (address _factory, IBentoBoxV1 _bentoBox, bytes32 _pairCodeHash) public {
        factory = _factory;
        bentoBox = _bentoBox;
        pairCodeHash = _pairCodeHash;
    }

    function getOutputAmount (IERC20 tokenIn, IERC20 tokenOut, uint256 amountMinOut, address[] calldata path, uint256 shareIn) external view returns (uint256 amountOut){
        uint256 amountIn = bentoBox.toAmount(tokenIn, shareIn, false);
        uint256[] memory amounts = UniswapV2Library.getAmountsOut(factory, amountIn, path, pairCodeHash);
        amountOut = amounts[amounts.length - 1];
    }

    function swap (IERC20 tokenIn, IERC20 tokenOut, uint256 amountMinOut, address[] calldata path, uint256 shareIn) external returns (uint256 amountOut, uint256 shareOut) {
        (uint256 amountIn, ) = bentoBox.withdraw(tokenIn, address(this), address(this), 0, shareIn);
        amountOut = _swapExactTokensForTokens(amountIn, amountMinOut, path, address(bentoBox));
        (, shareOut) = bentoBox.deposit(tokenOut, address(bentoBox), msg.sender, amountOut, 0);
    }

    // Swaps an exact amount of tokens for another token through the path passed as an argument
    // Returns the amount of the final token
    function _swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] memory path,
        address to
    ) internal returns (uint256 amountOut) {
        uint256[] memory amounts = UniswapV2Library.getAmountsOut(factory, amountIn, path, pairCodeHash);
        amountOut = amounts[amounts.length - 1];
        require(amountOut >= amountOutMin, "insufficient-amount-out");
        IERC20(path[0]).safeTransfer(UniswapV2Library.pairFor(factory, path[0], path[1], pairCodeHash), amountIn);
        _swap(amounts, path, to);
    }

    // requires the initial amount to have already been sent to the first pair
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
            address to = i < path.length - 2 ? UniswapV2Library.pairFor(factory, output, path[i + 2], pairCodeHash) : _to;
            IUniswapV2Pair(UniswapV2Library.pairFor(factory, input, output, pairCodeHash)).swap(
                amount0Out,
                amount1Out,
                to,
                new bytes(0)
            );
        }
    }

}