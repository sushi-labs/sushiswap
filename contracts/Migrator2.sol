pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./uniswapv2/interfaces/IUniswapV2Pair.sol";
import "./uniswapv2/interfaces/IUniswapV2Router01.sol";

contract Migrator2 {
    using SafeERC20 for IERC20;

    IUniswapV2Router01 public oldRouter;
    IUniswapV2Router01 public router;

    constructor(IUniswapV2Router01 _oldRouter, IUniswapV2Router01 _router) public {
        oldRouter = _oldRouter;
        router = _router;
    }

    // msg.sender should have approved 'liquidity' amount of LP token of 'tokenA' and 'tokenB'
    function migrate(
        IERC20 tokenA,
        IERC20 tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        uint deadline
    ) external {
        // Remove existing liquidity from 'oldRouter'
        address pair = pairFor(oldRouter.factory(), address(tokenA), address(tokenB));
        IERC20(pair).safeTransferFrom(msg.sender, address(this), liquidity);
        IERC20(pair).approve(address(oldRouter), liquidity);
        (uint256 amountA, uint256 amountB) = oldRouter.removeLiquidity(
            address(tokenA),
            address(tokenB),
            liquidity,
            amountAMin,
            amountBMin,
            address(this),
            deadline
        );

        // Approve max is ok because it's only to this contract and this contract has no other functionality
        // Also some ERC20 tokens will fail when approving a set amount twice, such as USDT. Must approve 0 first. This circumvests that issue.
        tokenA.approve(address(router), uint256(-1));
        tokenB.approve(address(router), uint256(-1));

        // Add liquidity to 'router'
        (uint256 pooledAmountA, uint256 pooledAmountB,) = router.addLiquidity(
            address(tokenA),
            address(tokenB),
            amountA,
            amountB,
            amountAMin,
            amountBMin,
            address(msg.sender),
            deadline
        );

        // Send remaining token balances to msg.sender
        // No safeMath used because pooledAmount must be <= amount
        tokenA.safeTransfer(msg.sender, amountA - pooledAmountA);
        tokenB.safeTransfer(msg.sender, amountB - pooledAmountB);
    }

    // returns sorted token addresses, used to handle return values from pairs sorted in this order
    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');
        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');
    }

    // calculates the CREATE2 address for a pair without making any external calls
    function pairFor(address factory, address tokenA, address tokenB) internal pure returns (address pair) {
        (address token0, address token1) = sortTokens(tokenA, tokenB);
        pair = address(uint(keccak256(abi.encodePacked(
                hex'ff',
                factory,
                keccak256(abi.encodePacked(token0, token1)),
                hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f' // init code hash
            ))));
    }
}
