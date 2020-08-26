pragma solidity 0.6.12;

import "./uniswapv2/interfaces/IUniswapV2ERC20.sol";
import "./uniswapv2/interfaces/IUniswapV2Pair.sol";
import "./uniswapv2/interfaces/IUniswapV2Factory.sol";


contract Migrator {
    address public chef;
    address public factory;
    uint256 public notBeforeBlock;
    uint256 public desiredLiquidity = uint256(-1);

    constructor(address _chef, address _factory, uint256 _notBeforeBlock) public {
        chef = _chef;
        factory = _factory;
        notBeforeBlock = _notBeforeBlock;
    }

    function migrate(address orig) public returns (address) {
        require(msg.sender == chef, "not the chef");
        require(block.number >= notBeforeBlock, "too early to migrate");
        address token0 = IUniswapV2Pair(orig).token0();
        address token1 = IUniswapV2Pair(orig).token1();
        address pair = IUniswapV2Factory(factory).getPair(token0, token1);
        if (pair == address(0)) {
            pair = IUniswapV2Factory(factory).createPair(token0, token1);
        }
        uint256 lp = IUniswapV2ERC20(orig).balanceOf(msg.sender);
        if (lp == 0) return pair;
        desiredLiquidity = lp;
        IUniswapV2ERC20(orig).transferFrom(msg.sender, orig, lp);
        IUniswapV2Pair(orig).burn(pair);
        IUniswapV2Pair(pair).mint(msg.sender);
        desiredLiquidity = uint256(-1);
        return pair;
    }
}