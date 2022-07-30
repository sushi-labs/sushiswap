// File contracts/swappers/SushiSwapMultiSwapper.sol
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

// solhint-disable avoid-low-level-calls

// File @boringcrypto/boring-solidity/contracts/interfaces/IERC20.sol@v1.2.1
// License-Identifier: MIT
interface IERC20 {

}

// File @boringcrypto/boring-solidity/contracts/libraries/BoringERC20.sol@v1.2.1
// License-Identifier: MIT

library BoringERC20 {
    bytes4 private constant SIG_TRANSFER = 0xa9059cbb; // transfer(address,uint256)

    /// @notice Provides a safe ERC20.transfer version for different ERC-20 implementations.
    /// Reverts on a failed transfer.
    /// @param token The address of the ERC-20 token.
    /// @param to Transfer tokens to.
    /// @param amount The token amount.
    function safeTransfer(
        IERC20 token,
        address to,
        uint256 amount
    ) internal {
        (bool success, bytes memory data) = address(token).call(abi.encodeWithSelector(SIG_TRANSFER, to, amount));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "BoringERC20: Transfer failed");
    }
}

// File @boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol@v1.2.1
// License-Identifier: MIT

/// @notice A library for performing overflow-/underflow-safe math,
/// updated with awesomeness from of DappHub (https://github.com/dapphub/ds-math).
library BoringMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
        require((c = a + b) >= b, "BoringMath: Add Overflow");
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256 c) {
        require((c = a - b) <= a, "BoringMath: Underflow");
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
        require(b == 0 || (c = a * b) / b == a, "BoringMath: Mul Overflow");
    }
}

// File @sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Pair.sol@v1.4.2
// License-Identifier: GPL-3.0

interface IUniswapV2Pair {
    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );

    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes calldata data
    ) external;
}

// File contracts/libraries/UniswapV2Library.sol
// License-Identifier: GPL-3.0

library UniswapV2Library {
    using BoringMath for uint256;

    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, "UniswapV2Library: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), "UniswapV2Library: ZERO_ADDRESS");
    }

    // calculates the CREATE2 address for a pair without making any external calls
    function pairFor(
        address factory,
        address tokenA,
        address tokenB,
        bytes32 pairCodeHash
    ) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(
            uint256(
                keccak256(
                    abi.encodePacked(
                        hex"ff",
                        factory,
                        keccak256(abi.encodePacked(token0, token1)),
                        pairCodeHash // init code hash
                    )
                )
            )
        );
    }

    // fetches and sorts the reserves for a pair
    function getReserves(
        address factory,
        address tokenA,
        address tokenB,
        bytes32 pairCodeHash
    ) internal view returns (uint256 reserveA, uint256 reserveB) {
        (address token0, ) = sortTokens(tokenA, tokenB);
        (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(pairFor(factory, tokenA, tokenB, pairCodeHash)).getReserves();
        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);
    }

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256 amountOut) {
        require(amountIn > 0, "UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT");
        require(reserveIn > 0 && reserveOut > 0, "UniswapV2Library: INSUFFICIENT_LIQUIDITY");
        uint256 amountInWithFee = amountIn.mul(997);
        uint256 numerator = amountInWithFee.mul(reserveOut);
        uint256 denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    // performs chained getAmountOut calculations on any number of pairs
    function getAmountsOut(
        address factory,
        uint256 amountIn,
        address[] memory path,
        bytes32 pairCodeHash
    ) internal view returns (uint256[] memory amounts) {
        require(path.length >= 2, "UniswapV2Library: INVALID_PATH");
        amounts = new uint256[](path.length);
        amounts[0] = amountIn;
        for (uint256 i; i < path.length - 1; i++) {
            (uint256 reserveIn, uint256 reserveOut) = getReserves(factory, path[i], path[i + 1], pairCodeHash);
            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
        }
    }
}

// File @sushiswap/bentobox-sdk/contracts/IBentoBoxV1.sol@v1.0.2
// License-Identifier: MIT

interface IBentoBoxV1 {
    function deposit(
        IERC20 token_,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external payable returns (uint256 amountOut, uint256 shareOut);

    function toAmount(
        IERC20 token,
        uint256 share,
        bool roundUp
    ) external view returns (uint256 amount);

    function withdraw(
        IERC20 token_,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external returns (uint256 amountOut, uint256 shareOut);
}

// File contracts/swappers/SushiSwapMultiSwapper.sol
// License-Identifier: GPL-3.0

contract SushiSwapMultiSwapper {
    using BoringERC20 for IERC20;
    using BoringMath for uint256;

    address private immutable factory;
    IBentoBoxV1 private immutable bentoBox;
    bytes32 private immutable pairCodeHash;

    constructor(
        address _factory,
        IBentoBoxV1 _bentoBox,
        bytes32 _pairCodeHash
    ) public {
        factory = _factory;
        bentoBox = _bentoBox;
        pairCodeHash = _pairCodeHash;
    }

    function getOutputAmount(
        IERC20 tokenIn,
        address[] calldata path,
        uint256 shareIn
    ) external view returns (uint256 amountOut) {
        uint256 amountIn = bentoBox.toAmount(tokenIn, shareIn, false);
        uint256[] memory amounts = UniswapV2Library.getAmountsOut(factory, amountIn, path, pairCodeHash);
        amountOut = amounts[amounts.length - 1];
    }

    function swap(
        IERC20 tokenIn,
        IERC20 tokenOut,
        uint256 amountMinOut,
        address path1,
        address path2,
        address to,
        uint256 baseShare,
        uint256 shareIn
    ) external returns (uint256) {
        address[] memory path;
        if (path2 == address(0)) {
            if (path1 == address(0)) {
                path = new address[](2);
                path[1] = address(tokenOut);
            } else {
                path = new address[](3);
                path[1] = path1;
                path[2] = address(tokenOut);
            }
        } else {
            path = new address[](4);
            path[1] = path1;
            path[2] = path2;
            path[3] = address(tokenOut);
        }
        path[0] = address(tokenIn);
        (uint256 amountIn, ) = bentoBox.withdraw(tokenIn, address(this), UniswapV2Library.pairFor(factory, path[0], path[1], pairCodeHash), 0, shareIn);
        uint256 amount = _swapExactTokensForTokens(amountIn, amountMinOut, path, address(bentoBox));
        (, uint256 share) = bentoBox.deposit(tokenOut, address(bentoBox), to, amount, 0);
        return baseShare.add(share);
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
            (uint256 amount0Out, uint256 amount1Out) = input == token0 ? (uint256(0), amountOut) : (amountOut, uint256(0));
            address to = i < path.length - 2 ? UniswapV2Library.pairFor(factory, output, path[i + 2], pairCodeHash) : _to;
            IUniswapV2Pair(UniswapV2Library.pairFor(factory, input, output, pairCodeHash)).swap(amount0Out, amount1Out, to, new bytes(0));
        }
    }
}
