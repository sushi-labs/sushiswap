// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.11;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

struct BridgeState {
    uint256 currentAssetSD;
    uint256 lpAsset;
    uint256 eqFeePool;
    uint256 idealBalance;
    uint256 currentBalance;
    bool allocPointIsPositive;
}

struct Fees {
    uint256 eqFee;
    uint256 eqReward;
    uint256 lpFee;
    uint256 protocolFee;
}

contract StargateFeeV04Extraction {
    using SafeMath for uint256;

    //---------------------------------------------------------------------------
    // VARIABLES

    // equilibrium func params. all in BPs * 10 ^ 2, i.e. 1 % = 10 ^ 6 units
    uint256 public constant DENOMINATOR = 1e18;
    uint256 public constant DELTA_1 = 6000 * 1e14;
    uint256 public constant DELTA_2 = 500 * 1e14;
    uint256 public constant LAMBDA_1 = 40 * 1e14;
    uint256 public constant LAMBDA_2 = 9960 * 1e14;
    uint256 public constant LP_FEE = 10 * 1e13;
    uint256 public constant PROTOCOL_FEE = 50 * 1e13;
    uint256 public constant PROTOCOL_SUBSIDY = 3 * 1e13;

    uint256 public constant FIFTY_PERCENT = 5 * 1e17;
    uint256 public constant SIXTY_PERCENT = 6 * 1e17;

    constructor() {}

    // function getBridgeState(
    //     uint256 srcPoolId,
    //     uint256 dstPoolId,
    //     uint16 dstChainId,
    //     address from
    // ) external view returns (BridgeState memory state, bool whitelisted) {        
    //     IStargateFeeLibrary feeLibrary = STARGATE_POOL_ADDRESS[srcChainId][srcBridgeToken.address].feeLibrary()
    //     Pool pool = feeLibrary.factory().getPool(srcPoolId);
    //     state.currentAssetSD = IERC20(pool.token()).balanceOf(address(pool)).div(pool.convertRate());
    //     state.lpAsset = pool.totalLiquidity();
    //     state.eqFeePool = pool.eqFeePool();

    //     Pool.ChainPath memory chainPath = pool.getChainPath(dstChainId, dstPoolId);
    //     state.idealBalance = chainPath.idealBalance;
    //     state.currentBalance = chainPath.balance;
    //     (, uint256 allocPoint, , ) = feeLibrary.lpStaking().poolInfo(feeLibrary.poolIdToLpId(srcPoolId));
    //     state.allocPointIsPositive = allocPoint > 0
    //     whitelisted = feeLibrary.whitelist(from);
    // }

    function getFees(
        BridgeState memory state,
        bool whitelisted,
        uint256 amountSD
    ) external pure returns (Fees memory s) {
        // calculate the equilibrium reward
        s.eqReward = _getEqReward(state, amountSD);

        // calculate the equilibrium fee
        uint256 protocolSubsidy;
        (s.eqFee, protocolSubsidy) = _getEquilibriumFee(state, amountSD);

        // return no protocol/lp fees for addresses in this mapping
        if (whitelisted) {
            return s;
        }

        // calculate protocol and lp fee
        (s.protocolFee, s.lpFee) = _getProtocolAndLpFee(state, amountSD, protocolSubsidy);

        return s;
    }
 
    function _getEqReward(
        BridgeState memory state,
        uint256 amountSD
    ) internal pure returns (uint256 eqReward) {
        if (state.lpAsset <= state.currentAssetSD) {
            return 0;
        }

        uint256 poolDeficit = state.lpAsset.sub(state.currentAssetSD);
        // assets in pool are < 75% of liquidity provided & amount transferred > 2% of pool deficit
        if (state.currentAssetSD.mul(100).div(state.lpAsset) < 75 && amountSD.mul(100) > poolDeficit.mul(2)) {
            // reward capped at rewardPoolSize
            eqReward = state.eqFeePool.mul(amountSD).div(poolDeficit);
            if (eqReward > state.eqFeePool) {
                eqReward = state.eqFeePool;
            }
        } else {
            eqReward = 0;
        }
    }

    function _getEquilibriumFee(
        BridgeState memory state,
        uint256 amountSD
    ) internal pure returns (uint256, uint256) {
        uint256 beforeBalance = state.currentBalance;
        uint256 idealBalance = state.idealBalance;

        require(beforeBalance >= amountSD, "Stargate: not enough balance");
        uint256 afterBalance = beforeBalance.sub(amountSD);

        uint256 safeZoneMax = idealBalance.mul(DELTA_1).div(DENOMINATOR);
        uint256 safeZoneMin = idealBalance.mul(DELTA_2).div(DENOMINATOR);

        uint256 eqFee = 0;
        uint256 protocolSubsidy = 0;

        if (afterBalance >= safeZoneMax) {
            // no fee zone, protocol subsidize it.
            eqFee = amountSD.mul(PROTOCOL_SUBSIDY).div(DENOMINATOR);
            protocolSubsidy = eqFee;
        } else if (afterBalance >= safeZoneMin) {
            // safe zone
            uint256 proxyBeforeBalance = beforeBalance < safeZoneMax ? beforeBalance : safeZoneMax;
            eqFee = _getTrapezoidArea(LAMBDA_1, 0, safeZoneMax, safeZoneMin, proxyBeforeBalance, afterBalance);
        } else {
            // danger zone
            if (beforeBalance >= safeZoneMin) {
                // across 2 or 3 zones
                // part 1
                uint256 proxyBeforeBalance = beforeBalance < safeZoneMax ? beforeBalance : safeZoneMax;
                eqFee = eqFee.add(_getTrapezoidArea(LAMBDA_1, 0, safeZoneMax, safeZoneMin, proxyBeforeBalance, safeZoneMin));
                // part 2
                eqFee = eqFee.add(_getTrapezoidArea(LAMBDA_2, LAMBDA_1, safeZoneMin, 0, safeZoneMin, afterBalance));
            } else {
                // only in danger zone
                // part 2 only
                eqFee = eqFee.add(_getTrapezoidArea(LAMBDA_2, LAMBDA_1, safeZoneMin, 0, beforeBalance, afterBalance));
            }
        }
        return (eqFee, protocolSubsidy);
    }

    function _getProtocolAndLpFee(
        BridgeState memory state,
        uint256 amountSD,
        uint256 protocolSubsidy
    ) internal pure returns (uint256 protocolFee, uint256 lpFee) {
        protocolFee = amountSD.mul(PROTOCOL_FEE).div(DENOMINATOR).sub(protocolSubsidy);
        lpFee = amountSD.mul(LP_FEE).div(DENOMINATOR);

        // when there are active emissions, give the lp fee to the protocol
        if (state.allocPointIsPositive) {
            protocolFee = protocolFee.add(lpFee);
            lpFee = 0;
        }

        if (state.lpAsset == 0) {
            return (protocolFee, lpFee);
        }

        bool isAboveIdeal = state.currentBalance.sub(amountSD) > state.idealBalance.mul(SIXTY_PERCENT).div(DENOMINATOR);
        uint256 currentAssetNumerated = state.currentAssetSD.mul(DENOMINATOR).div(state.lpAsset);
        if (currentAssetNumerated <= FIFTY_PERCENT && isAboveIdeal) {
            // x <= 50% => no fees
            protocolFee = 0;
            lpFee = 0;
        } else if ( currentAssetNumerated < SIXTY_PERCENT && isAboveIdeal) {
            // 50% > x < 60% => scaled fees &&
            // the resulting transfer does not drain the pathway below 60% o`f the ideal balance,

            // reduce the protocol and lp fee linearly
            // Examples:
            // currentAsset == 101, lpAsset == 200 -> haircut == 5%
            // currentAsset == 115, lpAsset == 200 -> haircut == 75%
            // currentAsset == 119, lpAsset == 200 -> haircut == 95%
            uint256 haircut = currentAssetNumerated.sub(FIFTY_PERCENT).mul(10); // scale the percentage by 10
            protocolFee = protocolFee.mul(haircut).div(DENOMINATOR);
            lpFee = lpFee.mul(haircut).div(DENOMINATOR);
        }

        // x > 60% => full fees
    }

    function _getTrapezoidArea(
        uint256 lambda,
        uint256 yOffset,
        uint256 xUpperBound,
        uint256 xLowerBound,
        uint256 xStart,
        uint256 xEnd
    ) internal pure returns (uint256) {
        require(xEnd >= xLowerBound && xStart <= xUpperBound, "Stargate: balance out of bound");
        uint256 xBoundWidth = xUpperBound.sub(xLowerBound);

        // xStartDrift = xUpperBound.sub(xStart);
        uint256 yStart = xUpperBound.sub(xStart).mul(lambda).div(xBoundWidth).add(yOffset);

        // xEndDrift = xUpperBound.sub(xEnd)
        uint256 yEnd = xUpperBound.sub(xEnd).mul(lambda).div(xBoundWidth).add(yOffset);

        // compute the area
        uint256 deltaX = xStart.sub(xEnd);
        return yStart.add(yEnd).mul(deltaX).div(2).div(DENOMINATOR);
    }
}