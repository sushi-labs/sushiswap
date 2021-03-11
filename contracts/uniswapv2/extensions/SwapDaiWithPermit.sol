// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./uniswapv2/interfaces/IUniswapV2Router02.sol";

interface IDAI {
    function approve(address usr, uint256 wad) external returns (bool);
    
    function pull(address usr, uint256 wad) external;

    function permit(
        address holder,
        address spender,
        uint256 nonce,
        uint256 expiry,
        bool allowed,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract SwapDaiWithPermit {
    IDAI private constant dai = IDAI(0x6B175474E89094C44Da98b954EedeAC495271d0F); // Dai token contract
    IUniswapV2Router02 private constant sushiSwapRouter = IUniswapV2Router02(0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F); // SushiSwap router contract

    struct Permit {
        address holder;
        address spender;
        uint256 nonce;
        uint256 expiry;
        bool allowed;
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    constructor() public {
        dai.approve(address(sushiSwapRouter), type(uint256).max);
    }

    function swapExactDaiForTokensWithPermit(
        uint256 amountIn,
        uint256 amountOutMin,
        address toToken,
        address to,
        Permit calldata permit)
        external
        returns (uint256[] memory amounts)
    {
        dai.permit(
            permit.holder,
            permit.spender,
            permit.nonce,
            permit.expiry,
            permit.allowed,
            permit.v,
            permit.r,
            permit.s
        );
        
        dai.pull(permit.holder, amountIn);
        
        address[] memory path = new address[](2);
        path[0] = address(dai);
        path[1] = toToken;
        
        amounts = sushiSwapRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, to, permit.expiry); 
    }
}
