// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./uniswapv2/interfaces/IUniswapV2ERC20.sol";
import "./uniswapv2/interfaces/IUniswapV2Pair.sol";
import "./uniswapv2/interfaces/IUniswapV2Factory.sol";

// SushiMaker is MasterChef's left hand and kinda a wizard. He can cook up Sushi from pretty much anything!
//
// This contract handles "serving up" rewards for xSushi holders by trading tokens collected from fees for Sushi.

contract SushiMaker {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IUniswapV2Factory public constant factory = IUniswapV2Factory(0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac);
    address public constant bar = 0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272;
    address public constant sushi = 0x6B3595068778DD592e39A122f4f5a5cF09C90fE2;
    address public constant weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    function convert(address token0, address token1) public {
        // At least we try to make front-running harder to do.
        require(msg.sender == tx.origin, "do not convert from contract");
        
        IUniswapV2Pair pair = IUniswapV2Pair(factory.getPair(token0, token1));
        pair.transfer(address(pair), pair.balanceOf(address(this)));
        (uint amount0, uint amount1) = pair.burn(address(this));
        if (token0 != pair.token0()) {
            (amount0, amount1) = (amount1, amount0);
        }
        uint256 wethAmount = _toWETH(token0, amount0) + _toWETH(token1, amount1);
        _toSUSHI(wethAmount);
    }

    function _toWETH(address token, uint amountIn) internal returns (uint256) {
        if (token == sushi) {
            _safeTransfer(token, bar, amountIn);
            return 0;
        }
        if (token == weth) {
            _safeTransfer(token, factory.getPair(weth, sushi), amountIn);
            return amountIn;
        }
        IUniswapV2Pair pair = IUniswapV2Pair(factory.getPair(token, weth));
        if (address(pair) == address(0)) {
            return 0;
        }
        (uint reserve0, uint reserve1,) = pair.getReserves();
        address token0 = pair.token0();
        (uint reserveIn, uint reserveOut) = token0 == token ? (reserve0, reserve1) : (reserve1, reserve0);
        uint amountInWithFee = amountIn.mul(997);
        uint amountOut = amountInWithFee.mul(reserveOut) / reserveIn.mul(1000).add(amountInWithFee);
        (uint amount0Out, uint amount1Out) = token0 == token ? (uint(0), amountOut) : (amountOut, uint(0));
        _safeTransfer(token, address(pair), amountIn);
        pair.swap(amount0Out, amount1Out, factory.getPair(weth, sushi), new bytes(0));
        return amountOut;
    }

    function _toSUSHI(uint256 amountIn) internal {
        IUniswapV2Pair pair = IUniswapV2Pair(factory.getPair(weth, sushi));
        (uint reserve0, uint reserve1,) = pair.getReserves();
        address token0 = pair.token0();
        (uint reserveIn, uint reserveOut) = token0 == weth ? (reserve0, reserve1) : (reserve1, reserve0);
        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        uint amountOut = numerator / denominator;
        (uint amount0Out, uint amount1Out) = token0 == weth ? (uint(0), amountOut) : (amountOut, uint(0));
        pair.swap(amount0Out, amount1Out, bar, new bytes(0));
    }

    function _safeTransfer(address token, address to, uint256 amount) internal {
        IERC20(token).safeTransfer(to, amount);
    }
}
