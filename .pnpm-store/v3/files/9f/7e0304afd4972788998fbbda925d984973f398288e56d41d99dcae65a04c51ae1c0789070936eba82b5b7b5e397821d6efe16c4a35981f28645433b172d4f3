// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "../../interfaces/IConcentratedLiquidityPool.sol";
import "../../libraries/TickMath.sol";
import "../../libraries/Ticks.sol";

/// @notice Trident Concentrated Liquidity Pool periphery contract to read state.
contract ConcentratedLiquidityPoolHelper {
    struct SimpleTick {
        int24 index;
        uint128 liquidity;
    }

    function getTickState(IConcentratedLiquidityPool pool, uint24 tickCount) external view returns (SimpleTick[] memory) {
        SimpleTick[] memory ticks = new SimpleTick[](tickCount); // todo save tickCount in the core contract

        IConcentratedLiquidityPool.Tick memory tick;
        uint24 i;
        int24 current = TickMath.MIN_TICK;

        while (current != TickMath.MAX_TICK) {
            tick = pool.ticks(current);
            ticks[i++] = SimpleTick({index: current, liquidity: tick.liquidity});
            current = tick.nextTick;
        }

        tick = pool.ticks(current);
        ticks[i] = SimpleTick({index: TickMath.MAX_TICK, liquidity: tick.liquidity});

        return ticks;
    }
}
