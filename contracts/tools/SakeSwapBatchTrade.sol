// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "../sakeswap/interfaces/ISakeSwapRouter.sol";
import "../sakeswap/interfaces/IERC20.sol";
import "../sakeswap/interfaces/IWETH.sol";
import "../sakeswap/interfaces/ISakeSwapFactory.sol";
import "../sakeswap/interfaces/ISakeSwapPair.sol";
import "../sakeswap/libraries/SafeMath.sol";

contract SakeSwapBatchTrade {
    using SafeMath for uint256;
    ISakeSwapFactory public factory = ISakeSwapFactory(0x75e48C954594d64ef9613AeEF97Ad85370F13807);
    ISakeSwapRouter public router = ISakeSwapRouter(0x9C578b573EdE001b95d51a55A3FAfb45f5608b1f);
    address public weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    // constructor(address _router, address _weth, address _factory) public {
    //     router = ISakeSwapRouter(_router);
    //     weth = _weth;
    //     factory = ISakeSwapFactory(_factory);
    // }

    event MultiSwap(address indexed user, uint256 consume, uint256 stoken, uint256 lptoken);

    receive() external payable {
        assert(msg.sender == weth); // only accept ETH via fallback from the WETH contract
    }

    function swapExactETHForTokens(
        address token,
        uint8 swapTimes,
        bool addLiquidity
    )
        external
        payable
        returns (
            uint256 consumeAmount,
            uint256 stokenAmount,
            uint256 lptokenAmount
        )
    {
        require(msg.value > 0 && (swapTimes > 0 || addLiquidity == true), "invalid params");
        consumeAmount = msg.value;
        address pair = factory.getPair(weth, token);
        address stoken = ISakeSwapPair(pair).stoken();
        IWETH(weth).deposit{value: msg.value}();
        IERC20(weth).approve(address(router), uint256(-1));
        IERC20(token).approve(address(router), uint256(-1));
        if (swapTimes > 0) _swapExactTokensForTokens(weth, token, swapTimes);
        uint256 remain = IERC20(weth).balanceOf(address(this));
        if (addLiquidity) {
            lptokenAmount = _addLiquidity(weth, token, remain);
            uint256 wethDust = IERC20(weth).balanceOf(address(this));
            if (wethDust > 0) {
                IWETH(weth).withdraw(wethDust);
                msg.sender.transfer(wethDust);
            }
            IERC20(token).transfer(msg.sender, IERC20(token).balanceOf(address(this)));
            consumeAmount = consumeAmount.sub(wethDust);
        } else {
            IWETH(weth).withdraw(remain);
            msg.sender.transfer(remain);
            consumeAmount = consumeAmount.sub(remain);
        }
        stokenAmount = IERC20(stoken).balanceOf(address(this));
        IERC20(stoken).transfer(msg.sender, stokenAmount);
        emit MultiSwap(msg.sender, consumeAmount, stokenAmount, lptokenAmount);
    }

    // function swapExactTokensForTokens(
    //     address tokenA,
    //     address tokenB,
    //     uint256 amountIn,
    //     uint8 swapTimes,
    //     bool addLiquidity
    // )
    //     external
    //     returns (
    //         uint256 consumeAmount,
    //         uint256 stokenAmount,
    //         uint256 lptokenAmount
    //     )
    // {
    //     require(amountIn > 0 && (swapTimes > 0 || addLiquidity == true), "invalid params");
    //     IERC20(tokenA).approve(address(router), uint256(-1));
    //     IERC20(tokenB).approve(address(router), uint256(-1));
    //     address pair = factory.getPair(tokenA, tokenB);
    //     address stoken = ISakeSwapPair(pair).stoken();
    //     IERC20(tokenA).transferFrom(msg.sender, address(this), amountIn);
    //     if (swapTimes > 0) _swapExactTokensForTokens(tokenA, tokenB, swapTimes);
    //     if (addLiquidity) lptokenAmount = _addLiquidity(tokenA, tokenB, IERC20(tokenA).balanceOf(address(this)));
    //     consumeAmount = amountIn.sub(IERC20(tokenA).balanceOf(address(this)));
    //     stokenAmount = IERC20(stoken).balanceOf(address(this));
    //     IERC20(tokenA).transfer(msg.sender, IERC20(tokenA).balanceOf(address(this)));
    //     IERC20(tokenB).transfer(msg.sender, IERC20(tokenB).balanceOf(address(this)));
    //     IERC20(stoken).transfer(msg.sender, stokenAmount);
    //     emit MultiSwap(msg.sender, consumeAmount, stokenAmount, lptokenAmount);
    // }

    function _swapExactTokensForTokens(
        address tokenA,
        address tokenB,
        uint8 swapTimes
    ) internal {
        address[] memory pathForward = new address[](2);
        address[] memory pathBackward = new address[](2);
        pathForward[0] = tokenA;
        pathForward[1] = tokenB;
        pathBackward[0] = tokenB;
        pathBackward[1] = tokenA;
        for (uint8 i = 0; i < swapTimes; i++) {
            uint256 amountA = IERC20(tokenA).balanceOf(address(this));
            router.swapExactTokensForTokens(amountA, 0, pathForward, address(this), now + 60, true);
            uint256 amountB = IERC20(tokenB).balanceOf(address(this));
            router.swapExactTokensForTokens(amountB, 0, pathBackward, address(this), now + 60, true);
        }
    }

    function _addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amount
    ) internal returns (uint256 liquidity) {
        uint256 half = amount / 2;
        uint256 swapAmount = amount.sub(half);
        address[] memory path = new address[](2);
        path[0] = tokenA;
        path[1] = tokenB;
        router.swapExactTokensForTokens(swapAmount, 0, path, address(this), now + 60, false);
        (, , liquidity) = router.addLiquidity(
            tokenA,
            tokenB,
            half,
            IERC20(tokenB).balanceOf(address(this)),
            0,
            0,
            msg.sender,
            now + 60
        );
    }
}
