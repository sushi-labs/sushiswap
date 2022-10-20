// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "./IBentoBoxMinimal.sol";
import "./IMasterDeployer.sol";
import "../libraries/Ticks.sol";

/// @notice Trident concentrated liquidity pool contract Structs.
interface IConcentratedLiquidityPoolStruct {
    struct Tick {
        int24 previousTick;
        int24 nextTick;
        uint128 liquidity;
        uint256 feeGrowthOutside0; // Per unit of liquidity.
        uint256 feeGrowthOutside1;
        uint160 secondsGrowthOutside;
    }
    struct Position {
        uint128 liquidity;
        uint256 feeGrowthInside0Last;
        uint256 feeGrowthInside1Last;
    }

    struct MintParams {
        int24 lowerOld;
        int24 lower;
        int24 upperOld;
        int24 upper;
        uint128 amount0Desired;
        uint128 amount1Desired;
        bool native;
    }

    struct SwapCache {
        uint256 feeAmount;
        uint256 totalFeeAmount;
        uint256 protocolFee;
        uint256 feeGrowthGlobalA;
        uint256 feeGrowthGlobalB;
        uint256 currentPrice;
        uint256 currentLiquidity;
        uint256 input;
        int24 nextTickToCross;
    }
}

/// @notice Trident Concentrated Liquidity Pool interface.
interface IConcentratedLiquidityPool is IConcentratedLiquidityPoolStruct {
    function ticks(int24 _tick) external view returns (Tick memory);

    function positions(
        address owner,
        int24 lower,
        int24 upper
    ) external view returns (Position memory);

    function feeGrowthGlobal0() external view returns (uint256);

    function feeGrowthGlobal1() external view returns (uint256);

    function rangeFeeGrowth(int24 lowerTick, int24 upperTick) external view returns (uint256 feeGrowthInside0, uint256 feeGrowthInside1);

    function setPrice(uint160 price) external;

    function collect(int24 lower, int24 upper) external returns (uint256 amount0fees, uint256 amount1fees);

    function mint(MintParams memory data) external returns (uint256 liquidityMinted);

    function burn(
        int24 lower,
        int24 upper,
        uint128 amount
    )
        external
        returns (
            uint256 token0Amount,
            uint256 token1Amount,
            uint256 token0Fees,
            uint256 token1Fees
        );

    function getImmutables()
        external
        view
        returns (
            uint128 _MAX_TICK_LIQUIDITY,
            uint24 _tickSpacing,
            uint24 _swapFee,
            address _barFeeTo,
            IBentoBoxMinimal _bento,
            IMasterDeployer _masterDeployer,
            address _token0,
            address _token1
        );

    function getPriceAndNearestTicks() external view returns (uint160 _price, int24 _nearestTick);

    function getTokenProtocolFees() external view returns (uint128 _token0ProtocolFee, uint128 _token1ProtocolFee);

    function getReserves() external view returns (uint128 _reserve0, uint128 _reserve1);

    function getAssets() external view returns (address[] memory tokens);

    function getSecondsGrowthAndLastObservation() external view returns (uint160 _secondGrowthGlobal, uint32 _lastObservation);
}
