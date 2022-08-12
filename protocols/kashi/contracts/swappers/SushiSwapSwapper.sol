// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "@boringcrypto/boring-solidity/contracts/libraries/BoringMath.sol";
import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Factory.sol";
import "@sushiswap/core/contracts/uniswapv2/interfaces/IUniswapV2Pair.sol";
import "../interfaces/ISwapper.sol";
import "@sushiswap/bentobox-sdk/contracts/IBentoBoxV1.sol";

contract SushiSwapSwapper is ISwapper {
    using BoringMath for uint256;

    // Local variables
    IBentoBoxV1 public immutable bentoBox;
    IUniswapV2Factory public immutable factory;
    bytes32 public immutable pairCodeHash;

    constructor(
        IBentoBoxV1 bentoBox_,
        IUniswapV2Factory factory_,
        bytes32 pairCodeHash_
    ) public {
        bentoBox = bentoBox_;
        factory = factory_;
        pairCodeHash = pairCodeHash_;
    }

    // Given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256 amountOut) {
        uint256 amountInWithFee = amountIn.mul(997);
        uint256 numerator = amountInWithFee.mul(reserveOut);
        uint256 denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    // Given an output amount of an asset and pair reserves, returns a required input amount of the other asset
    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256 amountIn) {
        uint256 numerator = reserveIn.mul(amountOut).mul(1000);
        uint256 denominator = reserveOut.sub(amountOut).mul(997);
        amountIn = (numerator / denominator).add(1);
    }

    // Swaps to a flexible amount, from an exact input amount
    /// @inheritdoc ISwapper
    function swap(
        IERC20 fromToken,
        IERC20 toToken,
        address recipient,
        uint256 shareToMin,
        uint256 shareFrom
    ) public override returns (uint256 extraShare, uint256 shareReturned) {
        (IERC20 token0, IERC20 token1) = fromToken < toToken ? (fromToken, toToken) : (toToken, fromToken);
        IUniswapV2Pair pair =
            IUniswapV2Pair(
                uint256(
                    keccak256(abi.encodePacked(hex"ff", factory, keccak256(abi.encodePacked(address(token0), address(token1))), pairCodeHash))
                )
            );

        (uint256 amountFrom, ) = bentoBox.withdraw(fromToken, address(this), address(pair), 0, shareFrom);

        (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
        uint256 amountTo;
        if (toToken > fromToken) {
            amountTo = getAmountOut(amountFrom, reserve0, reserve1);
            pair.swap(0, amountTo, address(bentoBox), new bytes(0));
        } else {
            amountTo = getAmountOut(amountFrom, reserve1, reserve0);
            pair.swap(amountTo, 0, address(bentoBox), new bytes(0));
        }
        (, shareReturned) = bentoBox.deposit(toToken, address(bentoBox), recipient, amountTo, 0);
        extraShare = shareReturned.sub(shareToMin);
    }

    // Swaps to an exact amount, from a flexible input amount
    /// @inheritdoc ISwapper
    function swapExact(
        IERC20 fromToken,
        IERC20 toToken,
        address recipient,
        address refundTo,
        uint256 shareFromSupplied,
        uint256 shareToExact
    ) public override returns (uint256 shareUsed, uint256 shareReturned) {
        IUniswapV2Pair pair;
        {
            (IERC20 token0, IERC20 token1) = fromToken < toToken ? (fromToken, toToken) : (toToken, fromToken);
            pair = IUniswapV2Pair(
                uint256(
                    keccak256(abi.encodePacked(hex"ff", factory, keccak256(abi.encodePacked(address(token0), address(token1))), pairCodeHash))
                )
            );
        }
        (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();

        uint256 amountToExact = bentoBox.toAmount(toToken, shareToExact, true);

        uint256 amountFrom;
        if (toToken > fromToken) {
            amountFrom = getAmountIn(amountToExact, reserve0, reserve1);
            (, shareUsed) = bentoBox.withdraw(fromToken, address(this), address(pair), amountFrom, 0);
            pair.swap(0, amountToExact, address(bentoBox), "");
        } else {
            amountFrom = getAmountIn(amountToExact, reserve1, reserve0);
            (, shareUsed) = bentoBox.withdraw(fromToken, address(this), address(pair), amountFrom, 0);
            pair.swap(amountToExact, 0, address(bentoBox), "");
        }
        bentoBox.deposit(toToken, address(bentoBox), recipient, 0, shareToExact);
        shareReturned = shareFromSupplied.sub(shareUsed);
        if (shareReturned > 0) {
            bentoBox.transfer(fromToken, address(this), refundTo, shareReturned);
        }
    }
}
