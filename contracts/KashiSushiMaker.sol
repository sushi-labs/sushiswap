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

interface IKashiWithdrawFee {
    function asset() external view returns (address);
    function balanceOf(address account) external view returns (uint256);
    function withdrawFees() external;
    function removeAsset(address to, uint256 fraction) external returns (uint256 share);
}

// KashiSushiMaker is MasterChef's left hand and kinda a wizard. He can cook up Sushi from pretty much anything!
// This contract handles "serving up" rewards for xSushi holders by trading tokens collected from Kashi fees for Sushi.
contract KashiSushiMaker is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    
    // V1 - V5: OK
    IUniswapV2Factory private immutable factory;
    //0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac
    // V1 - V5: OK
    address private immutable bar;
    //0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272
    // V1 - V5: OK
    IBentoBoxWithdraw private immutable bentoBox;
    //0xB5891167796722331b7ea7824F036b3Bdcb4531C
    // V1 - V5: OK
    address private immutable sushi;
    //0x6B3595068778DD592e39A122f4f5a5cF09C90fE2
    // V1 - V5: OK
    address private immutable weth;
    //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

    ValidationOracle private validationOracle;
    
    uint256 private impactDivisor;
    
    // V1 - V5: OK
    mapping(address => address) private _bridges;
    
    // E1: OK
    event LogBridgeSet(address indexed token, address indexed bridge);
    // E1: OK
    event LogConvert(
        address indexed server,
        address indexed asset,
        uint256 amount,
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
    
    // F1 - F10: OK
    // C1 - C24: OK
    function bridgeFor(address token) public view returns (address bridge) {
        bridge = _bridges[token];
        if (bridge == address(0)) {
            bridge = weth;
        }
    }

    // F1 - F10: OK
    // C1 - C24: OK
    function setBridge(address token, address bridge) external onlyOwner {
        // Checks
        require(
            token != sushi && token != weth && token != bridge,
            "Maker: Invalid bridge"
        );

        // Effects
        _bridges[token] = bridge;
        emit LogBridgeSet(token, bridge);
    }

    function setValidationOracle(ValidationOracle _validationOracle) external onlyOwner {
        validationOracle = _validationOracle;
    }

    function setImpactDivisor(uint256 _impactDivisor) external onlyOwner{
        impactDivisor = _impactDivisor;
    }
    
    // M1 - M5: OK
    // C1 - C24: OK
    // C6: It's not a fool proof solution, but it prevents flash loans, so here it's ok to use tx.origin
    modifier onlyEOA() {
        // Try to make flash-loan exploit harder to do by only allowing externally-owned addresses.
        require(msg.sender == tx.origin, "Maker: must use EOA");
        _;
    }
    
    // F1 - F10: OK
    // F3: _convert is separate to save gas by only checking the 'onlyEOA' modifier once in case of convertMultiple
    // F6: There is an exploit to add lots of SUSHI to the bar, run convert, then remove the SUSHI again.
    //     As the size of the SushiBar has grown, this requires large amounts of funds and isn't super profitable anymore
    //     The onlyEOA modifier prevents this being done with a flash loan.
    // C1 - C24: OK
    function convert(IKashiWithdrawFee kashiPair) external onlyEOA {
        _convert(kashiPair);
    }
    
    // F1 - F10: OK, see convert
    // C1 - C24: OK
    // C3: Loop is under control of the caller
    function convertMultiple(IKashiWithdrawFee[] calldata kashiPair) external onlyEOA {
        for (uint256 i = 0; i < kashiPair.length; i++) {
            _convert(kashiPair[i]);
        }
    }
    
    function _convert(IKashiWithdrawFee kashiPair) private {
        // update Kashi fee balance for this maker contract (`feeTo`)
        kashiPair.withdrawFees();
        
        // convert Kashi balance to Bento balance
        kashiPair.removeAsset(address(this), kashiPair.balanceOf(address(this)));
        
        // convert Bento balance to underlying `asset` for Maker
        IERC20 asset = IERC20(kashiPair.asset());
        bentoBox.withdraw(asset, address(this), address(this), 0, bentoBox.balanceOf(asset, address(this)));
        uint256 assetBalance = asset.balanceOf(address(this));
        
        // if returned Kashi fee `asset` is `sushi` - send balance to `bar` - else, swap for `sushi`
        uint256 amountOut;
        if (address(asset) == sushi) {
            IERC20(sushi).safeTransfer(bar, assetBalance);
            amountOut = assetBalance;
        } else {
            address bridge = bridgeFor(address(asset));
            // if `sushi` is bridge, swap from `asset` to `sushi` and send to `bar`
            if (bridge == sushi) {
                amountOut = _swap(address(asset), bridge, assetBalance, bar);
            } else {
                uint256 bridgeBalance = _swap(address(asset), bridge, assetBalance, address(this));
                amountOut = _swap(bridge, sushi, bridgeBalance, bar);
            }
        }
        
        emit LogConvert(
            msg.sender,
            address(asset),
            assetBalance,
            amountOut
        );
    }

    function _swap(
        address fromToken,
        address toToken,
        uint256 amountIn,
        address to
    ) private returns (uint256 amountOut) {
        // Checks
        // X1 - X5: OK
        IUniswapV2Pair pair =
            IUniswapV2Pair(factory.getPair(fromToken, toToken));
        require(address(pair) != address(0), "Maker: Cannot convert");

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
        } else {
            amountOut =
                amountIn.mul(997).mul(reserve0) /
                reserve1.mul(1000).add(amountInWithFee);
            IERC20(fromToken).safeTransfer(address(pair), amountIn);
            pair.swap(amountOut, 0, to, new bytes(0));
            require(amountIn < reserve1 / impactDivisor, "Maker: Impact too high");
        }
    }
}
