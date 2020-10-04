// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "../sakeswap/interfaces/ISakeSwapRouter.sol";
import "../sakeswap/interfaces/IERC20.sol";
import "../sakeswap/interfaces/IWETH.sol";
import "../sakeswap/interfaces/ISakeSwapFactory.sol";
import "../sakeswap/interfaces/ISakeSwapPair.sol";

contract SakeSwapBatchTrade {
    ISakeSwapFactory public factory = ISakeSwapFactory(0x75e48C954594d64ef9613AeEF97Ad85370F13807);
    ISakeSwapRouter public router = ISakeSwapRouter(0x9C578b573EdE001b95d51a55A3FAfb45f5608b1f);
    address public weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    
    // constructor(address _router, address _weth, address _factory) public {
    //     router = ISakeSwapRouter(_router);
    //     weth = _weth;
    //     factory = ISakeSwapFactory(_factory);
    // }
    
    receive() external payable {
        assert(msg.sender == weth); // only accept ETH via fallback from the WETH contract
    }

    function swapExactETHForTokens(address token, uint8 swapTimes) external payable {
        require(msg.value > 0 && swapTimes > 0 && swapTimes < 40, "invalid params");
        address pair = factory.getPair(weth, token);
        address stoken = ISakeSwapPair(pair).stoken();
        IWETH(weth).deposit{value: msg.value}();
        _swapExactTokensForTokens(weth, token, swapTimes);
        uint256 remain = IERC20(weth).balanceOf(address(this));
        IWETH(weth).withdraw(remain);
        msg.sender.transfer(remain);
        IERC20(stoken).transfer(msg.sender, IERC20(stoken).balanceOf(address(this)));
    }

    function swapExactTokensForTokens(address tokenA, address tokenB, uint256 amountIn, uint8 swapTimes) external {
        require(amountIn > 0 && swapTimes > 0 && swapTimes < 40, "invalid params");
        address pair = factory.getPair(tokenA, tokenB);
        address stoken = ISakeSwapPair(pair).stoken();
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountIn);
        _swapExactTokensForTokens(tokenA, tokenB, swapTimes);
        IERC20(tokenA).transfer(msg.sender, IERC20(tokenA).balanceOf(address(this)));
        IERC20(stoken).transfer(msg.sender, IERC20(stoken).balanceOf(address(this)));
    }

    function _swapExactTokensForTokens(address tokenA, address tokenB, uint8 swapTimes) internal {
        address[] memory pathForward = new address[](2);
        address[] memory pathBackward = new address[](2);
        pathForward[0] = tokenA; pathForward[1] = tokenB;
        pathBackward[0] = tokenB; pathBackward[1] = tokenA;
        IERC20(tokenA).approve(address(router), uint256(-1));
        IERC20(tokenB).approve(address(router), uint256(-1));
        for (uint8 i = 0; i < swapTimes; i++) {
            uint256 amountA = IERC20(tokenA).balanceOf(address(this));
            router.swapExactTokensForTokens(amountA, 0, pathForward, address(this), now + 60, true);
            uint256 amountB = IERC20(tokenB).balanceOf(address(this));
            router.swapExactTokensForTokens(amountB, 0, pathBackward, address(this), now + 60, true);
        }
    }
}
