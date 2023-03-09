// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >= 0.8.0;

import "../interfaces/IPoolFactory.sol";

import "./PoolTemplate.sol";

/**
 * @author Mudit Gupta
 */
abstract contract PoolFactory is IPoolFactory {
    // Consider deploying via an upgradable proxy to allow upgrading pools in the future

    function deployPool(bytes memory _deployData) external override returns (address) {
        return address(new PoolTemplate(_deployData));
    }
}
