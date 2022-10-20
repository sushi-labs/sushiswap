// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "../abstract/SelfPermit.sol";
import "../abstract/Multicall.sol";
import "../interfaces/IUniswapV2Minimal.sol";
import "../interfaces/IBentoBoxMinimal.sol";
import "../interfaces/ITridentRouter.sol";
import "../interfaces/IMasterDeployer.sol";
import "../interfaces/IPoolFactory.sol";
import "../interfaces/IPool.sol";
import "../interfaces/IConstantProductPool.sol";

/// @notice Liquidity migrator from UniV2 style pool to Trident Constant product pool.
contract TridentSushiRollCP is SelfPermit, Multicall {
    error MinimumOutput();

    IBentoBoxMinimal public immutable bentoBox;
    IPoolFactory public immutable poolFactoryCP;
    IMasterDeployer public immutable masterDeployer;

    constructor(
        IBentoBoxMinimal _bentoBox,
        IPoolFactory _poolFactoryCP,
        IMasterDeployer _masterDeployer
    ) {
        bentoBox = _bentoBox;
        poolFactoryCP = _poolFactoryCP;
        masterDeployer = _masterDeployer;
    }

    /** @notice Function to migrate existing Sushiswap or other Uniswap V2 style pools to Trident.
        @param pair Uniswap V2 style liquidity pool address.
        @param amount Liquidity amount (Lp token balance) to be migrated.
        @param swapFee Swap fee of the Trident CP pool we are migrating into.
        @param twapSupport Whether the Trident CP pool we are migrating into supports twap oracles.
        @param minToken0Received Slippage protection for removing liquidity from a UniV2 style pool.
        @param minToken1Received Slippage protection for removing liquidity from a UniV2 style pool.
        @param minLpReceived Slippage protection for minting liquidity on the Trident CP pool.
        @dev If the pool with the current conditions doesn't exist it will be deployed. */
    function migrateLegacyToCP(
        IUniswapV2Minimal pair,
        uint256 amount,
        uint256 swapFee,
        bool twapSupport,
        uint256 minToken0Received,
        uint256 minToken1Received,
        uint256 minLpReceived
    ) external returns (uint256 liquidity) {
        address token0 = pair.token0();
        address token1 = pair.token1();

        bytes memory poolData = abi.encode(token0, token1, swapFee, twapSupport);
        address tridentPool = poolFactoryCP.configAddress(keccak256(poolData));

        if (tridentPool == address(0)) {
            tridentPool = masterDeployer.deployPool(address(poolFactoryCP), poolData);
        }

        pair.transferFrom(msg.sender, address(pair), amount);
        (uint256 amount0, uint256 amount1) = pair.burn(address(bentoBox));

        if (amount0 < minToken0Received || amount1 < minToken1Received) revert MinimumOutput();

        bentoBox.deposit(token0, address(bentoBox), tridentPool, amount0, 0);
        bentoBox.deposit(token1, address(bentoBox), tridentPool, amount1, 0);

        liquidity = IPool(tridentPool).mint(abi.encode(msg.sender));

        if (liquidity < minLpReceived) revert MinimumOutput();
    }

    /** @notice Function to migrate betewwn Trident CP pools with different fee / twap settings.
        @param currentPool Trident CP pool address we want to migrate from. Can be form an outdated CP factory.
        @param amount Liquidity amount (Lp token balance) to be migrated.
        @param swapFee Swap fee of the Trident CP pool we are migrating into.
        @param twapSupport Whether the Trident CP pool we are migrating into supports twap oracles.
        @param minToken0Received Slippage protection for removing liquidity. Values are in BentoBox shares.
        @param minToken1Received Slippage protection for removing liquidity. Values are in BentoBox shares.
        @param minLpReceived Slippage protection for minting liquidity on the Trident CP pool.
        @dev If the pool with the current conditions doesn't exist it will be deployed. */
    function migrateCP(
        IConstantProductPool currentPool,
        uint256 amount,
        uint256 swapFee,
        bool twapSupport,
        uint256 minToken0Received,
        uint256 minToken1Received,
        uint256 minLpReceived
    ) external returns (uint256 liquidity) {
        address[] memory tokens = currentPool.getAssets();

        bytes memory newPoolData = abi.encode(tokens[0], tokens[1], swapFee, twapSupport);

        address newPool = poolFactoryCP.configAddress(keccak256(newPoolData));

        if (newPool == address(0)) {
            newPool = masterDeployer.deployPool(address(poolFactoryCP), newPoolData);
        }

        currentPool.transferFrom(msg.sender, address(currentPool), amount);

        IPool.TokenAmount[] memory tokenAmounts = currentPool.burn(abi.encode(newPool, false));

        (uint256 amount0, uint256 amount1) = (tokenAmounts[0].amount, tokenAmounts[1].amount);

        if (amount0 < minToken0Received || amount1 < minToken1Received) revert MinimumOutput();

        liquidity = IPool(newPool).mint(abi.encode(msg.sender));

        if (liquidity < minLpReceived) revert MinimumOutput();
    }
}
