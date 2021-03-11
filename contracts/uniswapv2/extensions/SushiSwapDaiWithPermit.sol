// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

/// @dev brief SushiSwap interface for token swapping - based on Uniswap v2 router system
interface ISushiSwapTokens {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
 
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
        
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

/// @dev brief interface for Dai token deposits with permit
interface IDAI {
    function approve(address usr, uint256 wad) external returns (bool);
    
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
    
    function transferFrom(address src, address dst, uint wad) external returns (bool);
}

contract SushiSwapDaiWithPermit {
    IDAI private constant dai = IDAI(0x6B175474E89094C44Da98b954EedeAC495271d0F); // Dai token contract
    ISushiSwapTokens private constant sushiSwapRouter = ISushiSwapTokens(0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F); // SushiSwap router contract

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
        
        dai.transferFrom(permit.holder, address(this), amountIn);
        
        address[] memory path = new address[](2);
        path[0] = address(dai);
        path[1] = toToken;
        
        amounts = sushiSwapRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, to, permit.expiry); 
    }
}
