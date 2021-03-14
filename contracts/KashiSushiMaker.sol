// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
import "./libraries/SafeMath.sol";
import "./libraries/SafeERC20.sol";

import "./uniswapv2/interfaces/IUniswapV2ERC20.sol";
import "./uniswapv2/interfaces/IUniswapV2Pair.sol";
import "./uniswapv2/interfaces/IUniswapV2Factory.sol";

import "./oracles/ValidationOracle.sol";

import "./Ownable.sol";

interface IBentoBoxWithdraw {
    function balanceOf(IERC20, address) external view returns (uint256);

    function withdraw(
        IERC20 token_,
        address from,
        address to,
        uint256 amount,
        uint256 share
    ) external returns (uint256 amountOut, uint256 shareOut);
}

interface IKashiFeeRedemption {
    function asset() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function withdrawFees() external;
    function removeAsset(address to, uint256 fraction) external returns (uint256 share);
}

// SingleSushiMaker is MasterChef's left hand and kinda a wizard. He can cook up Sushi from pretty much anything!
// This contract handles "serving up" rewards for xSushi holders by trading tokens collected from fees for Sushi.
contract KashiSushiMaker is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    
    // V1 - V5: OK
    IUniswapV2Factory public immutable factory;
    //0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac
    // V1 - V5: OK
    address public immutable bar;
    //0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272
    
    IBentoBoxWithdraw public immutable bentoBox;
    //0xB5891167796722331b7ea7824F036b3Bdcb4531C
    
    // V1 - V5: OK
    address private immutable sushi;
    //0x6B3595068778DD592e39A122f4f5a5cF09C90fE2
    // V1 - V5: OK
    address private immutable weth;
    //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

    ValidationOracle public validationOracle;
    
    uint256 private impactDivisor;
    
    // E1: OK
    event LogConvert(
        address indexed server,
        address indexed token0,
        address indexed token1,
        uint256 amount0,
        uint256 amount1,
        uint256 amountSUSHI
    );

    constructor(
        address _factory,
        address _bar,
        IBentoBoxWithdraw _bentoBox,
        address _sushi,
        address _weth,
        ValidationOracle _validationOracle
    ) public {
        factory = IUniswapV2Factory(_factory);
        bar = _bar;
        bentoBox = _bentoBox;
        sushi = _sushi;
        weth = _weth;
        impactDivisor = 10;
        validationOracle = _validationOracle;
    }

    function setValidationOracle(ValidationOracle _validationOracle) public onlyOwner {
        validationOracle = _validationOracle;
    }

    function setImpactDivisor(uint256 _impactDivisor) public onlyOwner{
        impactDivisor = _impactDivisor;
    }
    
    // M1 - M5: OK
    // C1 - C24: OK
    // C6: It's not a fool proof solution, but it prevents flash loans, so here it's ok to use tx.origin
    modifier onlyEOA() {
        // Try to make flash-loan exploit harder to do by only allowing externally owned addresses.
        require(msg.sender == tx.origin, "SushiMaker: must use EOA");
        _;
    }

    function convert(IKashiFeeRedemption kashiPair) external onlyEOA {
        _convert(kashiPair);
    }
    
    function _convert(IKashiFeeRedemption kashiPair) internal returns (uint256 amountOut) {
        // update Kashi fee balance for this contract (`feeTo`)
        kashiPair.withdrawFees();
        
        // convert Kashi balance to Bento balance
        uint256 kashiBalance = kashiPair.balanceOf(address(this));
        kashiPair.removeAsset(address(this), kashiBalance);
        
        // convert Bento balance to underlying `asset`
        IERC20 asset = IERC20(kashiPair.asset());
        uint256 bentoBalance = bentoBox.balanceOf(asset, address(this));
        bentoBox.withdraw(asset, address(this), address(this), 0, bentoBalance);
        
        uint256 assetBalance = asset.balanceOf(address(this));
        
        if (address(asset) == sushi) {
            IERC20(sushi).safeTransfer(bar, assetBalance);
            amountOut = assetBalance;
        } else {
            amountOut = _swap(address(asset), sushi, assetBalance, bar);
        }
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
