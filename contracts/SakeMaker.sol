pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./sakeswap/interfaces/ISakeSwapERC20.sol";
import "./sakeswap/interfaces/ISakeSwapPair.sol";
import "./sakeswap/interfaces/ISakeSwapFactory.sol";

contract SakeMaker is Ownable {
    using SafeMath for uint256;

    ISakeSwapFactory public factory;
    address public bar;
    address public sake;
    address public weth;
    uint8 public burnRatio = 3;

    constructor(ISakeSwapFactory _factory, address _bar, address _sake, address _weth) public {
        require(address(_factory) != address(0) && _bar != address(0) && 
            _sake != address(0) && _weth != address(0), "invalid address");
        factory = _factory;
        sake = _sake;
        bar = _bar;
        weth = _weth;
    }

    function convert(address token0, address token1) public {
        // At least we try to make front-running harder to do.
        require(msg.sender == tx.origin, "do not convert from contract");
        ISakeSwapPair pair = ISakeSwapPair(factory.getPair(token0, token1));
        pair.transfer(address(pair), pair.balanceOf(address(this)));
        pair.burn(address(this));
        uint256 wethAmount = _toWETH(token0) + _toWETH(token1);
        uint256 wethAmountToBurn = wethAmount.mul(burnRatio).div(10);
        uint256 wethAmountToBar = wethAmount.sub(wethAmountToBurn);
        IERC20(weth).transfer(factory.getPair(weth, sake), wethAmountToBar);
        _toSAKE(wethAmountToBar, bar);
        IERC20(weth).transfer(factory.getPair(weth, sake), wethAmountToBurn);
        _toSAKE(wethAmountToBurn, address(1));
    }

    function _toWETH(address token) internal returns (uint256) {
        if (token == sake) {
            uint amount = IERC20(token).balanceOf(address(this));
            uint amountToBurn = amount.mul(burnRatio).div(10);
            uint amountToBar = amount.sub(amountToBurn);
            IERC20(token).transfer(bar, amountToBar);
            IERC20(token).transfer(address(1), amountToBurn);
            return 0;
        }
        if (token == weth) {
            uint amount = IERC20(token).balanceOf(address(this));
            return amount;
        }
        ISakeSwapPair pair = ISakeSwapPair(factory.getPair(token, weth));
        if (address(pair) == address(0)) {
            return 0;
        }
        (uint reserve0, uint reserve1,) = pair.getReserves();
        address token0 = pair.token0();
        (uint reserveIn, uint reserveOut) = token0 == token ? (reserve0, reserve1) : (reserve1, reserve0);
        uint amountIn = IERC20(token).balanceOf(address(this));
        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        uint amountOut = numerator / denominator;
        (uint amount0Out, uint amount1Out) = token0 == token ? (uint(0), amountOut) : (amountOut, uint(0));
        IERC20(token).transfer(address(pair), amountIn);
        pair.swap(amount0Out, amount1Out, address(this), new bytes(0));
        return amountOut;
    }

    function _toSAKE(uint256 amountIn, address to) internal {
        ISakeSwapPair pair = ISakeSwapPair(factory.getPair(weth, sake));
        (uint reserve0, uint reserve1,) = pair.getReserves();
        address token0 = pair.token0();
        (uint reserveIn, uint reserveOut) = token0 == weth ? (reserve0, reserve1) : (reserve1, reserve0);
        // avoid stack too deep error
        uint amountOut;
        {
            uint amountInWithFee = amountIn.mul(997);
            uint numerator = amountInWithFee.mul(reserveOut);
            uint denominator = reserveIn.mul(1000).add(amountInWithFee);
            amountOut = numerator / denominator;
        }
        (uint amount0Out, uint amount1Out) = token0 == weth ? (uint(0), amountOut) : (amountOut, uint(0));
        pair.swap(amount0Out, amount1Out, to, new bytes(0));
    }

    function setBurnRatio(uint8 newRatio) public onlyOwner {
        require(newRatio >= 0 && newRatio <= 10, "invalid burn ratio");
        burnRatio = newRatio;
    }
}
