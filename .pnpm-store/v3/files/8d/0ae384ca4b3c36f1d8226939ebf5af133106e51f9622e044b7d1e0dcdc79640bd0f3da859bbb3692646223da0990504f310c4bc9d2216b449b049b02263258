// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >=0.8.0;

import "./ConcentratedLiquidityPool.sol";
import "../../abstract/PoolDeployer.sol";
import "../../interfaces/IConcentratedLiquidityPool.sol";

/// @notice Contract for deploying Trident exchange Concentrated Liquidity Pool with configurations.
/// @author Mudit Gupta.
contract ConcentratedLiquidityPoolFactory is PoolDeployer {
    constructor(address _masterDeployer) PoolDeployer(_masterDeployer) {}

    error WrongTokenOrder();

    function deployPool(bytes memory _deployData) external returns (address pool) {
        (address tokenA, address tokenB, uint24 swapFee, uint160 price, uint24 tickSpacing) = abi.decode(
            _deployData,
            (address, address, uint24, uint160, uint24)
        );

        // Revert instead of switching tokens and inverting price.
        if (tokenA > tokenB) revert WrongTokenOrder();

        // Strips any extra data.
        // Don't include price in _deployData to enable predictable address calculation.
        _deployData = abi.encode(tokenA, tokenB, swapFee, tickSpacing);

        address[] memory tokens = new address[](2);
        tokens[0] = tokenA;
        tokens[1] = tokenB;

        // Salt is not actually needed since `_deployData` is part of creationCode and already contains the salt.
        bytes32 salt = keccak256(_deployData);
        pool = address(new ConcentratedLiquidityPool{salt: salt}(_deployData, IMasterDeployer(masterDeployer)));
        _registerPool(pool, tokens, salt);

        IConcentratedLiquidityPool(pool).setPrice(price);
    }
}
