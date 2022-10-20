// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "./ConstantProductPool.sol";
import "./ConstantProductPoolFactory.sol";

/// @notice Helper Contract for fetching info for several pools
/// @author Ilya Lyalin
contract ConstantProductPoolFactoryHelper {
    struct ConstantProductPoolInfo {
        uint8 tokenA;
        uint8 tokenB;
        uint112 reserve0;
        uint112 reserve1;
        uint16 swapFeeAndTwapSupport;
    }

    // @dev tokens MUST be sorted i < j => token[i] < token[j]
    // @dev tokens.length < 256
    function getPoolsForTokens(address constantProductPoolFactory, address[] calldata tokens)
        external
        view
        returns (ConstantProductPoolInfo[] memory poolInfos, uint256 length)
    {
        ConstantProductPoolFactory factory = ConstantProductPoolFactory(constantProductPoolFactory);
        uint8 tokenNumber = uint8(tokens.length);
        uint256[] memory poolLength = new uint256[]((tokenNumber * (tokenNumber + 1)) / 2);
        uint256 pairNumber = 0;
        for (uint8 i = 0; i < tokenNumber; i++) {
            for (uint8 j = i + 1; j < tokenNumber; j++) {
                uint256 count = factory.poolsCount(tokens[i], tokens[j]);
                poolLength[pairNumber++] = count;
                length += count;
            }
        }
        poolInfos = new ConstantProductPoolInfo[](length);
        pairNumber = 0;
        uint256 poolNumber = 0;
        for (uint8 i = 0; i < tokenNumber; i++) {
            for (uint8 j = i + 1; j < tokenNumber; j++) {
                address[] memory pools = factory.getPools(tokens[i], tokens[j], 0, poolLength[pairNumber++]);
                for (uint256 k = 0; k < pools.length; k++) {
                    ConstantProductPoolInfo memory poolInfo = poolInfos[poolNumber++];
                    poolInfo.tokenA = i;
                    poolInfo.tokenB = j;
                    ConstantProductPool pool = ConstantProductPool(pools[k]);
                    (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast) = pool.getReserves();
                    poolInfo.reserve0 = reserve0;
                    poolInfo.reserve1 = reserve1;
                    poolInfo.swapFeeAndTwapSupport = uint16(pool.swapFee());
                    if (blockTimestampLast != 0) poolInfo.swapFeeAndTwapSupport += 1 << 15;
                }
            }
        }
    }
}
