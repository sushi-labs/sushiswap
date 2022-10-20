// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "../libraries/TickMath.sol";

contract TickMathMock {
    function getSqrtRatioAtTick(int24 tick) external pure returns (uint160) {
        return TickMath.getSqrtRatioAtTick(tick);
    }

    function getTickAtSqrtRatio(uint160 sqrtPriceX96) external pure returns (int24) {
        return TickMath.getTickAtSqrtRatio(sqrtPriceX96);
    }
}
