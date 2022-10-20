// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity >= 0.8.0;

import "../interfaces/IPoolFactory.sol";
import "../abstract/PoolDeployer.sol";
import "./PoolTemplateMock.sol";

contract PoolFactoryMock is PoolDeployer {
    constructor(address _masterDeployer) PoolDeployer(_masterDeployer) {}
    function deployPool(bytes memory _deployData) external onlyMaster returns (address pool) {
        (address tokenA, address tokenB) = abi.decode(_deployData, (address, address));

        // @dev correctly sorts tokens to ensure _register in PoolDeployer does not revert
        if (tokenA > tokenB) {
            (tokenA, tokenB) = (tokenB, tokenA);
        }

        // @dev Strips any extra data.
        _deployData = abi.encode(tokenA, tokenB);

        address[] memory tokens = new address[](2);
        tokens[0] = tokenA;
        tokens[1] = tokenB;

        // @dev Salt is not actually needed since `_deployData` is part of creationCode and already contains the salt.
        bytes32 salt = keccak256(_deployData);
        pool = address(new PoolTemplateMock{salt: salt}(_deployData));
        _registerPool(pool, tokens, salt);
    }
}
