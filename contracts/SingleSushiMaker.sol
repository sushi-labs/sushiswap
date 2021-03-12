// SPDX-License-Identifier: MIT

// P1 - P3: OK
pragma solidity 0.6.12;
import "./libraries/SafeMath.sol";
import "./libraries/SafeERC20.sol";

import "./uniswapv2/interfaces/IUniswapV2ERC20.sol";
import "./uniswapv2/interfaces/IUniswapV2Pair.sol";
import "./uniswapv2/interfaces/IUniswapV2Factory.sol";

import "./oracles/ValidationOracle.sol";

import "./Ownable.sol";

// SingleSushiMaker is MasterChef's left hand and kinda a wizard. He can cook up Sushi from pretty much anything!
// This contract handles "serving up" rewards for xSushi holders by trading tokens collected from fees for Sushi.
contract SingleSushiMaker is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    
    // V1 - V5: OK
    IUniswapV2Factory public immutable factory;
    //0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac
    // V1 - V5: OK
    address public immutable bar;
    //0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272
    // V1 - V5: OK
    address private immutable sushi;
    //0x6B3595068778DD592e39A122f4f5a5cF09C90fE2

    ValidationOracle public validationOracle;
    
    uint256 private impactDivisor;

    constructor(
        address _factory,
        address _bar,
        address _sushi,
        ValidationOracle _validationOracle
    ) public {
        factory = IUniswapV2Factory(_factory);
        bar = _bar;
        sushi = _sushi;
        impactDivisor = 10;
        validationOracle = _validationOracle;
    }

    function setValidationOracle(ValidationOracle _validationOracle) public onlyOwner {
        validationOracle = _validationOracle;
    }

    function setImpactDivisor(uint256 _impactDivisor) public onlyOwner{
        impactDivisor = _impactDivisor;
    }

    function convert(IERC20 fromToken) external returns (uint256 amountOut) {
        require(msg.sender == tx.origin, "SushiMaker: must use EOA");
        amountOut = _swap(address(fromToken), sushi, fromToken.balanceOf(address(this)), bar);
    }

    function _swap(
        address fromToken,
        address toToken,
        uint256 amountIn,
        address to
    ) internal returns (uint256 amountOut) {
        // Checks
        // X1 - X5: OK
        IUniswapV2Pair pair =
            IUniswapV2Pair(factory.getPair(fromToken, toToken));
        require(address(pair) != address(0), "SushiMaker: Cannot convert");

        // Interactions
        // X1 - X5: OK
        (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
        
        validationOracle.isWithinBounds(pair);

        uint256 amountInWithFee = amountIn.mul(997);
        if (fromToken == pair.token0()) {
            amountOut =
                amountIn.mul(997).mul(reserve1) /
                reserve0.mul(1000).add(amountInWithFee);
            IERC20(fromToken).safeTransfer(address(pair), amountIn);
            pair.swap(0, amountOut, to, new bytes(0));
            require(amountIn < reserve0 / impactDivisor, "Maker: Impact too high");
            // TODO: Add maximum slippage?
        } else {
            amountOut =
                amountIn.mul(997).mul(reserve0) /
                reserve1.mul(1000).add(amountInWithFee);
            IERC20(fromToken).safeTransfer(address(pair), amountIn);
            pair.swap(amountOut, 0, to, new bytes(0));

            require(amountIn < reserve1 / impactDivisor, "Maker: Impact too high");

            // TODO: Add maximum slippage?
        }
    }
}z

// SingleSushiMaker is MasterChef's left hand and kinda a wizard. He can cook up Sushi from pretty much anything!
// This contract handles "serving up" rewards for xSushi holders by trading tokens collected from fees for Sushi.
contract SingleSushiMaker is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    
    // V1 - V5: OK
    IUniswapV2Factory public immutable factory;
    //0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac
    // V1 - V5: OK
    address public immutable bar;
    //0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272
    // V1 - V5: OK
    address private immutable sushi;
    //0x6B3595068778DD592e39A122f4f5a5cF09C90fE2

    ValidationOracle public validationOracle;
    
    uint256 private impactDivisor;

    constructor(
        address _factory,
        address _bar,
        address _sushi,
        ValidationOracle _validationOracle
    ) public {
        factory = IUniswapV2Factory(_factory);
        bar = _bar;
        sushi = _sushi;
        impactDivisor = 10;
        validationOracle = _validationOracle;
    }

    function setValidationOracle(ValidationOracle _validationOracle) public onlyOwner {
        validationOracle = _validationOracle;
    }

    function setImpactDivisor(uint256 _impactDivisor) public onlyOwner{
        impactDivisor = _impactDivisor;
    }

    function convert(IERC20 fromToken) external returns (uint256 amountOut) {
        require(msg.sender == tx.origin, "SushiMaker: must use EOA");
        amountOut = _swap(address(fromToken), sushi, fromToken.balanceOf(address(this)), bar);
    }

    function _swap(
        address fromToken,
        address toToken,
        uint256 amountIn,
        address to
    ) internal returns (uint256 amountOut) {
        // Checks
        // X1 - X5: OK
        IUniswapV2Pair pair =
            IUniswapV2Pair(factory.getPair(fromToken, toToken));
        require(address(pair) != address(0), "SushiMaker: Cannot convert");

        // Interactions
        // X1 - X5: OK
        (uint256 reserve0, uint256 reserve1, ) = pair.getReserves();
        
        validationOracle.isWithinBounds(pair);

        uint256 amountInWithFee = amountIn.mul(997);
        if (fromToken == pair.token0()) {
            amountOut =
                amountIn.mul(997).mul(reserve1) /
                reserve0.mul(1000).add(amountInWithFee);
            IERC20(fromToken).safeTransfer(address(pair), amountIn);
            pair.swap(0, amountOut, to, new bytes(0));
            require(amountIn < reserve0 / impactDivisor, "Maker: Impact too high");
            // TODO: Add maximum slippage?
        } else {
            amountOut =
                amountIn.mul(997).mul(reserve0) /
                reserve1.mul(1000).add(amountInWithFee);
            IERC20(fromToken).safeTransfer(address(pair), amountIn);
            pair.swap(amountOut, 0, to, new bytes(0));

            require(amountIn < reserve1 / impactDivisor, "Maker: Impact too high");

            // TODO: Add maximum slippage?
        }
    }
}
